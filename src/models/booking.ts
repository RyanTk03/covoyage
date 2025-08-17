import mongoose from "mongoose";
import { BookingStateCodeEnum } from "@/lib/constants";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.String,
		index: true,
    },
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
    },
    state: {
        type: mongoose.Schema.Types.String,
        enum: Object.values(BookingStateCodeEnum),
    },
}, {
	timestamps: true
});

bookingSchema.index({ user: 1, ride: 1 }, { unique: true });

export type BookingDoc = mongoose.InferSchemaType<typeof bookingSchema>;

const Booking = mongoose.models.Booking || mongoose.model<BookingDoc>('Booking', bookingSchema);

export { Booking, bookingSchema };
