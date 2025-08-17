import { UserGenderCodeEnum } from "@/lib/constants"
import { BookingStateCodeEnum, NotificationTypeCodeEnum } from "@/lib/constants"

export interface BookingResponse {
	traveller: {
		imageUrl: string;
		username: string;
		rating: number;
	};
	travelId: string;
	state: BookingStateCodeEnum;
};

export interface PhotoResponse {
	user: {
		imageUrl: string;
		username: string;
	};
	path: string;
	uploadedAt: Date;
};

export interface ReviewResponse {
	id: string;
	reviewer: {
		userId: string;
		username: string;
		imageUrl: string;
	};
	rating: number;
	comment: string;
};

export interface UserResponse {
	username: string;
	gender: UserGenderCodeEnum;
	imageUrl: string;
	description: string;
	birthday: Date;
};

export interface RideResponse {
	owner: {
		id: string;
		imageUrl: string;
		username: string;
		gender: UserGenderCodeEnum;
		rating: number;
	};
	title: string;
	description: string;
	departure: {
		country: string;
		city: string;
		address: string;
		date: string;
	};
	arrival: {
		country: string;
		city: string;
		address: string;
	},
	preference: {
		numberOfTraveller: number;
		transport: string;
	};
	bookings?: {
		count: number;
		firsts: {
			userId: string;
			imageUrl: string;
			username: string;
			gender: UserGenderCodeEnum;
			rating: number;
		}[];
	};
	contact?: string;
};

export interface NotificationResponse {
	userId: string;
    type: NotificationTypeCodeEnum;
	isRead: boolean
	updatedAt: Date
}
