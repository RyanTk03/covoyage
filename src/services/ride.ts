import { Ride, RideDoc } from "@/models/ride";
import { connectToDatabase } from "../lib/db";
import { getAuthenticatedUser, getUser } from "./user";
import { NotificationTypeCodeEnum, RideStateCodeEnum } from "../lib/constants";
import mongoose from "mongoose";
import { Notification } from "@/models/notification";
import { Booking } from "@/models/booking";

interface RideSearchData {
	departure?: {
		city?: string;
		date?: string;
	};
	arrival?: {
		city?: string;
	}
	ownerMinScore?: number;
	transport?: string;
	maxTravellers?: number;
};

interface RideSearchAggregateResult {
	userId: string;
	transport: {
		label: string;
	};
	title: string;
	description: string;
	departure: Record<string, any>;
	arrival: Record<string, any>;
	numberOfTraveller: number;
	state: string;
}

function getSearchAggregatePipeline(searchData: RideSearchData): any[] {
	const matchParams: Record<string, any> = {
		"departure.date": { $gte: searchData?.departure?.date ? new Date(`${searchData?.departure?.date}T00:00:00Z`) : new Date() },
	};

	if (searchData?.departure?.city) {
		matchParams["departure.city"] = {
			$regex: `^${searchData.departure.city}$`,
			$options: "i"
		};
	}

	if (searchData?.arrival?.city) {
		matchParams["arrival.city"] = {
			$regex: `^${searchData.arrival.city}$`,
			$options: "i"
		};
	}

	if (searchData.maxTravellers) {
		matchParams["numberOfTraveller"] = { $lte: searchData.maxTravellers };
	}

	matchParams["state"] = RideStateCodeEnum.COMMING;

	return [
		{
			$match: {
				...matchParams,
				...(searchData.transport && { transport: new mongoose.Types.ObjectId(searchData.transport) }),
			}
		},
		{
			$lookup: {
				from: "users",
				localField: "userId",
				foreignField: "clerkId",
				as: "user_info"
			}
		},
		...(searchData?.ownerMinScore
			? [{ $match: { "user_info.score": { $gte: searchData.ownerMinScore } } }]
			: []),
		{
			$lookup: {
				from: "transports",
				localField: "transport",
				foreignField: "_id",
				as: "transport_info"
			}
		},
		// {
		// 	$project: {
		// 		"userId": { $arrayElemAt: ["$user_info.clerkId", 0] },
		// 		"transport": {
		// 			"label": { $arrayElemAt: ["$transport_info.label", 0] }
		// 		},
		// 		"title": 1,
		// 		"description": 1,
		// 		"departure": 1,
		// 		"arrival": 1,
		// 		"numberOfTraveller": 1,
		// 		"state": 1,
		// 	}
		// },
	]
}

async function getRide(id) {
	try {
		await connectToDatabase();
		const ride = await Ride.findOne({ _id: id })
			.populate({
				path: 'owner',
				select: 'clerkId score',
			});
		if (!ride) throw new Error('Ride not found');
		const user = await getUser(ride?.owner?.clerkId!);

		return {
			...ride._doc,
			owner: user,
		};
	} catch (error: any) {
		throw error;
	}
}

async function getUserRides(userId, state: string | null = null) {
	try {
		await connectToDatabase();
		const rides = await Ride.find({
			userId,
			...(state ? { state } : {})
		})
			.sort({ "departure.date": -1 });

		return rides;
	} catch (error: any) {
		throw error;
	}
}

async function getSearchedRides(
	searchParams: RideSearchData,
	limit: number,
	step: number
) {
	try {
		await connectToDatabase();
		const rides = await Ride.aggregate<RideSearchAggregateResult>(getSearchAggregatePipeline(searchParams))
			.sort({ createdAt: -1 })
			.skip(limit * step)
			.limit(limit);

		return await Promise.all(
			rides.map(async (ride) => {
				const user = await getUser(ride.userId);
				return {
					...ride,
					user,
				};
			})
		);
	} catch (error: any) {
		throw error;
	}
}

async function addRide(rideData: Omit<RideDoc, 'createdAt' | 'updatedAt'>) {
	try {
		await connectToDatabase();
		const userExists = await getUser(rideData.userId);
		if (!userExists) throw new Error("Invalid ride owner.");
		const departureDate = new Date(`${rideData.departure.date}T00:00:00Z`);
		const newRide = new Ride({
			...rideData,
			state: RideStateCodeEnum.COMMING
		});
		newRide.departure.date = departureDate;
		await newRide.save();

		return newRide;
	} catch (error: any) {
		throw error;
	}
}

async function updateRide(id, data) {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		const authenticatedUser = await getAuthenticatedUser();

		if (!authenticatedUser) throw new Error('Not allowed');

		await Ride.updateOne(
			{ _id: id, userId: authenticatedUser.clerkId },
			{ $set: { ...data } }
		).session(session);

		const bookings = await Booking.find({ ride: id })
			.populate("user", "clerkId")
			.session(session)
			.exec();

		const users = bookings.map((booking) => booking.user);

		await Notification.insertMany(
			users.map((user) => ({
				userId: user.clerkId,
				type: NotificationTypeCodeEnum.TRIP_MODIFIED,
				details: {
					ride: { _id: id },
				},
			})),
			{ session }
		);

		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}

async function deleteRide(id) {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		const authenticatedUser = await getAuthenticatedUser();

		if (!authenticatedUser) throw new Error('Not allowed');

		await Ride.deleteOne({ _id: id, userId: authenticatedUser.clerkId }).session(session);

		const bookings = await Booking.find({ ride: id })
			.populate("user", "clerkId")
			.session(session)
			.exec();

		const users = bookings.map((booking) => booking.user);

		await Notification.insertMany(
			users.map((user) => ({
				userId: user.clerkId,
				type: NotificationTypeCodeEnum.TRIP_CANCELLED,
				details: {
					ride: { _id: id },
				},
			})),
			{ session }
		);

		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}

async function closeRide(id) {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		const authenticatedUser = await getAuthenticatedUser();

		if (!authenticatedUser) throw new Error('Not allowed');

		await Ride.updateOne({ _id: id, userId: authenticatedUser.clerkId }, { $set: { state: RideStateCodeEnum.CLOSED }}).session(session);

		const bookings = await Booking.find({ ride: id })
			.populate("user", "clerkId")
			.session(session)
			.exec();

		const users = bookings.map((booking) => booking.user);

		await Notification.insertMany(
			users.map((user) => ({
				userId: user.clerkId,
				type: NotificationTypeCodeEnum.TRIP_CLOSED,
				details: {
					ride: { _id: id },
				},
			})),
			{ session }
		);

		await session.commitTransaction();
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}

export {
	getRide,
	getUserRides,
	getSearchedRides,
	addRide,
	updateRide,
	deleteRide,
	closeRide,
};
