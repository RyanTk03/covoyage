import mongoose from "mongoose";
import { NotificationTypeCodeEnum } from "@/lib/constants";

const notificationDetailsSchema = new mongoose.Schema({
	ride: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Ride',
		default: null,
	},
	user: {
		type: mongoose.Schema.Types.String,
		default: null,
	},
}, { _id: false })

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.String,
		index: true,
    },
    type: {
        type: mongoose.Schema.Types.String,
        enum: Object.values(NotificationTypeCodeEnum),
    },
    isRead: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
		index: true,
    },
	details: {
		type: notificationDetailsSchema,
		dafault: null
	}
}, {
	timestamps: true
})
.index({ userId: 1, isRead: 1 })
.index({ _id: 1, userId: 1, isRead: 1 });

export type NotificationDoc = mongoose.InferSchemaType<typeof notificationSchema>;

const Notification = mongoose.models.Notification || mongoose.model<NotificationDoc>('Notification', notificationSchema);

export { Notification, notificationSchema };
