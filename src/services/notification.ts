import { Notification } from "@/models/notification";
import { connectToDatabase } from "@/lib/db";
import { LIMIT_PER_REQUEST, NotificationTypeCodeEnum } from "@/lib/constants";
import { User } from "@/models/user";
import { getUser } from "./user";

async function addNotification(userId: string, data: {
	type: NotificationTypeCodeEnum,
	details?: object
}) {
	try {
		const notification = await Notification.create({
			userId,
			type: data.type,
			details: data.details,
		});

		return notification;
	} catch (error) {
		throw error;
	}
}

async function getNotifications(userId: string, params: {
	isRead: null | boolean,
	step: number
} = {
		isRead: null,
		step: 0
	}) {
	try {
		await connectToDatabase();

		const notifications = await Notification
			.find({
				userId,
				...(params.isRead !== null ? { isRead: params.isRead } : {})
			})
			.sort({ createdAt: -1 })
			.skip(LIMIT_PER_REQUEST.notifications * params.step)
			.limit(LIMIT_PER_REQUEST.notifications)
			.populate('details.user', 'clerkId')
			.populate('details.ride', '_id')
			.lean();

		return await Promise.all(notifications.map(async (notification) => {
			const user = notification?.details?.user?.clerkId && await getUser(notification.details.user.clerkId);
			return {
				...notification,
				...(notification.details &&
					{details: {
						...notification.details,
						...(user &&
							{ user: {
								clerkId: user.clerkId,
								username: user.username,
								imageUrl: user.imageUrl,
							}}
						),
					}}
				)
			}
		}));
	} catch (error: any) {
		throw error;
	}
}

async function getNotificationsCount(userId: string, isRead: boolean | null = null) {
	try {
		await connectToDatabase();

		if (isRead === null) {
			const result = await Notification.aggregate([
				{ $match: { userId } },
				{
					$group: {
						_id: "$isRead",
						count: { $sum: 1 },
					},
				},
			]);

			const counts = {
				unread: 0,
				read: 0,
			};

			for (const item of result) {
				if (item._id === true) counts.read = item.count;
				else counts.unread = item.count;
			}

			return counts;
		}

		// Fallback for specific isRead (true or false)
		const count = await Notification.countDocuments({ userId, isRead });
		return isRead ? {
			read: count
		} : {
			unread: count
		};

	} catch (error: any) {
		throw error;
	}
}


async function readNotification(userId: string, notificationId: string) {
	try {
		await connectToDatabase();
		const notifications = await Notification.updateOne({
			_id: notificationId,
			userId,
			isRead: false,
		}, { $set: { isRead: true, updatedAt: new Date() } });

		return notifications;
	} catch (error: any) {
		throw error;
	}
}

async function unreadNotification(userId: string, notificationId: string) {
	try {
		await connectToDatabase();
		const notifications = await Notification.updateOne({
			_id: notificationId,
			userId,
			isRead: true,
		}, { $set: { isRead: false, updatedAt: new Date() } });

		return notifications;
	} catch (error: any) {
		throw error;
	}
}

export { getNotifications, readNotification, unreadNotification, getNotificationsCount, addNotification };
