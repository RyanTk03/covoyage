import { Review } from "@/models/review";
import { connectToDatabase } from "@/lib/db";
import { BookingStateCodeEnum, LIMIT_PER_REQUEST } from "@/lib/constants";
import mongoose from "mongoose";
import { User } from "@/models/user";
import { Booking } from "@/models/booking";
import { Ride } from "@/models/ride";
import { getUser } from "./user";


async function getUserReviews(userId: string, params: {
	step: number
}) {
	try {
		await connectToDatabase();
		const reviews = await Review.find({
			reviewedId: userId
		})
			.populate({
				path: 'reviewer',
				select: 'clerkId',
			})
			.limit(LIMIT_PER_REQUEST.reviews)
			.skip(LIMIT_PER_REQUEST.reviews * params.step);

		return Promise.all(reviews.map(async (review) => {
			const user = await getUser(review.reviewer.clerkId);
			return {
				...review,
				reviewer: {
					clerkId: user.clerkId,
					imageUrl: user.imageUrl,
					username: user.username,
				},
			}
		}));
	} catch (error: any) {
		throw error;
	}
}

async function addUserReview(data: {
	comment: string,
	rating: number,
	reviewedId: string,
	reviewerId: string,
}) {
	await connectToDatabase();

	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		// Crée la review dans la transaction
		const review = await Review.create([data], { session });

		// Calcule la moyenne (en dehors de la transaction, car aggregation + transaction ne fonctionne pas bien)
		const result = await Review.aggregate([
			{ $match: { reviewedId: data.reviewedId } },
			{
				$group: {
					_id: '$reviewedId',
					avg: { $avg: '$rating' },
					count: { $sum: 1 }
				}
			}
		]);

		const { avg } = result[0] || { avg: 0 };

		// Mets à jour le score dans la transaction
		await User.findOneAndUpdate(
			{ clerkId: data.reviewedId },
			{ score: avg.toFixed(2) },
			{ session }
		);

		await session.commitTransaction();

		return review[0];
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
}

async function updateUserReview(reviewId: string, data: {
	comment: string,
	rating: number,
	reviewedId: string,
	reviewerId: string,
}) {
	await connectToDatabase();

	// Agrégation hors transaction (car MongoDB ne supporte pas aggregation dans transaction)
	const result = await Review.aggregate([
		{ $match: { reviewedId: new mongoose.Types.ObjectId(data.reviewedId) } },
		{
			$group: {
				_id: '$reviewedId',
				avg: { $avg: '$rating' },
				count: { $sum: 1 }
			}
		}
	]);
	const { avg } = result[0] || { avg: 0 };

	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		const review = await Review.findOneAndUpdate(
			{
				_id: reviewId,
				reviewedId: data.reviewedId,
				reviewerId: data.reviewerId,
			},
			data,
			{ new: true, session }
		);

		await User.findOneAndUpdate(
			{ clerkId: data.reviewedId },
			{ score: avg.toFixed(2) },
			{ session }
		);

		await session.commitTransaction();

		return { review };
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
}

async function userCanReview(reviewedId: string, reviewerId: string): Promise<boolean> {
	try {
		if (reviewedId === reviewerId) return false;

		// 1. reviewer booked a ride created by reviewed
		const bookedRide = await Booking.findOne({
			user: reviewerId,
			state: BookingStateCodeEnum.ACCEPTED
		})
			.populate({
				path: 'ride',
				match: { userId: reviewedId },
				select: '_id userId'
			});

		if (bookedRide?.ride) return true;

		// 2. reviewed booked a ride created by reviewer
		const rideIds = await Ride.find({ userId: reviewerId }, { _id: 1 }).lean();
		if (rideIds.length > 0) {
			const sharedBooking = await Booking.findOne({
				user: reviewedId,
				state: BookingStateCodeEnum.ACCEPTED,
				ride: { $in: rideIds.map(r => r._id) }
			}).lean();

			if (sharedBooking) return true;
		}

		// 3. Both booked the same ride created by another
		const reviewerBookings = await Booking.find({
			user: reviewerId,
			state: BookingStateCodeEnum.ACCEPTED
		}, { ride: 1 }).lean();

		const reviewerRideIds = reviewerBookings.map(b => b.ride);
		if (reviewerRideIds.length > 0) {
			const commonBooking = await Booking.findOne({
				user: reviewedId,
				state: BookingStateCodeEnum.ACCEPTED,
				ride: { $in: reviewerRideIds }
			}).lean();

			if (commonBooking) return true;
		}

		return false;
	} catch (error: any) {
		Error.captureStackTrace(error, userCanReview);
		throw error;
	}
}

async function userAlreadyReview(reviewedId: string, reviewerId: string) {
	try {
		const found = Review.find({
			reviewedId,
			reviewerId,
		});

		return !!found;
	} catch (error: any) {
		Error.captureStackTrace(error, userAlreadyReview);
		throw error;
	}

}


export {
	getUserReviews,
	addUserReview,
	updateUserReview,
	userCanReview,
	userAlreadyReview,
};
