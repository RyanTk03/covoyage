import { NotificationTypeCodeEnum } from "./constants";
import {
	BiUserPlus,
	BiCheckCircle,
	BiXCircle,
	BiMessageSquareDetail,
	BiTrip,
	BiSolidPlaneAlt,
	BiSolidBell,
} from "react-icons/bi";

import { IconType } from "react-icons";

interface NotificationDetails {
	user?: {
		clerkId: string;
		username: string;
		profilePicture?: string;
	};
	ride?: {
		_id: string;
	};
}

interface ResolvedNotification {
	subject: string;
	content: string;
	link: string;
	icon: IconType;
}

export function resolveNotification(
	type: NotificationTypeCodeEnum,
	details: NotificationDetails = {}
): ResolvedNotification {
	switch (type) {
		case NotificationTypeCodeEnum.WELCOME:
			return {
				subject: "Welcome to Co Voyage!",
				content: "Start your journey by creating a new trip or finding one that suits you.",
				link: "rides/search",
				icon: BiSolidBell,
			};
		case NotificationTypeCodeEnum.NEW_BOOKING:
			return {
				subject: "New travel request!",
				content: `A user has requested to join your trip. Click here to manage your passengers.`,
				link: `/dashboard/my-trips/${details.ride?._id}`,
				icon: BiUserPlus,
			};
		case NotificationTypeCodeEnum.BOOKING_ACCEPTED:
			return {
				subject: "You're in!",
				content: "Your request to join the trip has been accepted. Start packing!",
				link: "/travel/current",
				icon: BiCheckCircle,
			};
		case NotificationTypeCodeEnum.BOOKING_REJECTED:
			return {
				subject: "Request declined",
				content: "Unfortunately, your travel request was declined. Try another trip!",
				link: "/search",
				icon: BiXCircle,
			};
		case NotificationTypeCodeEnum.BOOKING_RENOUNCED:
			return {
				subject: "A traveler dropped out",
				content: `@${details.user?.username} has withdrawn from your trip. A seat just became available.`,
				link: "/search",
				icon: BiXCircle,
			};
		case NotificationTypeCodeEnum.TRIP_MODIFIED:
			return {
				subject: "Your trip was updated",
				content: "Your trip details have been updated. Take a moment to review the changes.",
				link: `/rides/${details.ride?._id}`,
				icon: BiTrip,
			};
		case NotificationTypeCodeEnum.TRIP_CANCELLED:
			return {
				subject: "Your trip was cancelled",
				content: "Your trip has been cancelled. Feel free to search for another one.",
				link: "/search",
				icon: BiSolidPlaneAlt,
			};
		case NotificationTypeCodeEnum.NEW_MESSAGE:
			return {
				subject: "New message received",
				content: `You’ve received a new message from @${details.user?.username}. Check your inbox.`,
				link: "/messages",
				icon: BiMessageSquareDetail,
			};
		default:
			return {
				subject: "Notification",
				content: "You’ve received a notification.",
				link: "",
				icon: BiSolidBell,
			};
	}
}
