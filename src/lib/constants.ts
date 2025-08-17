export enum RideStateCodeEnum {
    IN_PROGRESS = "001",
    CLOSED = "002",
    COMMING = "003",
};

export enum UserGenderCodeEnum {
    MAN = "001",
    WOMAN = "002",
};

export enum TransportCodeEnum {
    PIED = '000',
    CAR = '001',
    AIRPLANE = '002',
    MOTORCYCLE = '003',
};

export enum NotificationStateCodeEnum {
    READ = '001',
    UNREAD = '002',
    ALL = '003'
};

export enum WEBHOOK_ACTIONS_ENUM {
    NEW_USER='001',
    UPDATE_USER='002'
};

export enum NotificationTypeCodeEnum {
    WELCOME = '001',
    NEW_BOOKING = '002',
    BOOKING_ACCEPTED = '003',
    BOOKING_REJECTED = '004',
    BOOKING_RENOUNCED = '005',
    TRIP_CANCELLED = '006',
    TRIP_MODIFIED = '007',
    TRIP_CLOSED = '008',
    NEW_MESSAGE = '009',
};

export enum BookingStateCodeEnum {
    PENDING="001",
    ACCEPTED="002",
    REJECTED="003",
};

export const LIMIT_PER_REQUEST = {
    photos: 50,
    notifications: 50,
	reviews: 50,
} as const;
