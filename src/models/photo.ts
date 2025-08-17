import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    rideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
    },
    path: {
        type: mongoose.Schema.Types.String,
        maxlength: 255,
    },
    uploadedAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    }
});

export type PhotoDoc = mongoose.InferSchemaType<typeof photoSchema>;

const Photo = mongoose.models.Photo || mongoose.model<PhotoDoc>('Photo', photoSchema);

export { Photo, photoSchema };
