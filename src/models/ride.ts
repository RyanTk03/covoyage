import mongoose, { VirtualType } from "mongoose";
import { RideStateCodeEnum } from "@/lib/constants";
import { UserDoc } from "./user";

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        required: true,
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    departure: {
        type: {
            city: {
                type: mongoose.Schema.Types.String,
                required: true,
            },
            date: {
                type: mongoose.Schema.Types.Date,
                required: true,
            }
        },
        required: true,
    },
    arrival: {
        type: {
            city: {
                type: mongoose.Schema.Types.String,
                required: true,
            }
        },
        required: true,
    },
    numberOfTraveller: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
    transport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transport',
    },
    state: {
        type: mongoose.Schema.Types.String,
        enum: Object.values(RideStateCodeEnum),
    }
}, {
	timestamps: true
})

rideSchema.virtual('owner', {
	ref: 'User',
	localField: 'userId',
	foreignField: 'clerkId',
	justOne: true
});

rideSchema.set('toJSON', { virtuals: true });
rideSchema.set('toObject', { virtuals: true });

export type RideDoc = mongoose.InferSchemaType<typeof rideSchema> & {
	owner?: UserDoc | null;
};

const Ride = mongoose.models.Ride ?? mongoose.model('Ride', rideSchema);

export { Ride, rideSchema };
