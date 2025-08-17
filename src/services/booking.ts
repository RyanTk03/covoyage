import { BookingStateCodeEnum, NotificationTypeCodeEnum, RideStateCodeEnum } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/booking";
import { Notification } from "@/models/notification";
import { Ride } from "@/models/ride";
import mongoose from "mongoose";
import { getUser } from "./user";

export async function getUserBookings(userId: string) {
	try {
		const bookings = await Booking.find({ user: userId })
			.sort({ createdAt: -1 })
			.exec();

		return bookings;
	} catch (error) {
		throw error;
	}
}

export async function getRideBookings(rideId?: string, acceptedOnly = false) {
	try {
		const bookings = await Booking.find({ ride: rideId, ...(acceptedOnly && { state: BookingStateCodeEnum.ACCEPTED }) })
			.sort({ createdAt: -1 })
			.exec();

		return await Promise.all(bookings.map(async (booking) => {
			const user = await getUser(booking.user);
			return {
				...booking,
				user: {
					clerkId: booking.user,
					username: user.username,
					score: user.score,
					imageUrl: user.imageUrl,
				}
			}
		}));
	} catch (error) {
		throw error;
	}
}

export async function userCanBook(userId: string, rideId: string): Promise<boolean> {
	try {
		const lastBooking = await Booking.findOne({ user: userId })
			.sort({ createdAt: -1 })
			.populate('ride')
			.exec();

		if (!lastBooking) {
			return true;
		}

		if (lastBooking.ride?._id?.toString() === rideId) {
			return false;
		}

		const rideState = lastBooking.ride?.state;

		if (rideState && rideState !== RideStateCodeEnum.CLOSED) {
			return false;
		}

		return true;
	} catch (error) {
		throw error;
	}
}

export async function bookRide(userId: string, ride: Record<string, any>) {
	await connectToDatabase();

	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		const booking = await Booking.create(
			[{
				user: userId,
				ride: ride._id,
				state: BookingStateCodeEnum.PENDING
			}],
			{ session }
		);

		await Notification.create(
			[{
				type: NotificationTypeCodeEnum.NEW_BOOKING,
				userId: ride.userId,
				details: {
					ride: ride._id,
					user: userId,
				},
			}],
			{ session }
		);

		await session.commitTransaction();

		return booking[0];  // car create avec tableau renvoie un tableau

	} catch (error) {
		await session.abortTransaction();
		throw error;  // relance l'erreur
	} finally {
		await session.endSession();
	}
}


export async function acceptBooking(rideId: string, bookingId: string, currentUserId: string) {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		const ride = await Ride.findOne({ _id: rideId, userId: currentUserId }).session(session);
		if (!ride) throw new Error("Unauthorized or ride not found");

		const booking = await Booking.findOneAndUpdate(
			{ _id: bookingId, ride: rideId },
			{ state: BookingStateCodeEnum.ACCEPTED },
			{ new: true, session }
		).populate("user", "clerkId");
		if (!booking) throw new Error("Booking not found");

		await Notification.create([{
			userId: booking.user.clerkId,
			type: NotificationTypeCodeEnum.BOOKING_ACCEPTED,
			details: { ride: { _id: rideId } }
		}], { session });

		await session.commitTransaction();
		return booking;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}

export async function rejectBooking(rideId: string, bookingId: string, currentUserId: string) {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		const ride = await Ride.findOne({ _id: rideId, userId: currentUserId }).session(session);
		if (!ride) throw new Error("Unauthorized or ride not found");

		const booking = await Booking.findOneAndUpdate(
			{ _id: bookingId, ride: rideId },
			{ state: BookingStateCodeEnum.REJECTED },
			{ new: true, session }
		).populate("user", "clerkId");
		if (!booking) throw new Error("Booking not found");

		await Notification.create([{
			userId: booking.user.clerkId,
			type: NotificationTypeCodeEnum.BOOKING_REJECTED,
			details: { ride: { _id: rideId } }
		}], { session });

		await session.commitTransaction();
		return booking;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		session.endSession();
	}
}
