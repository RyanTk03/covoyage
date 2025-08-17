import { NotificationStateCodeEnum, NotificationTypeCodeEnum, RideStateCodeEnum } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { getRide, updateRide } from "@/services/ride";
import { Ride } from "@/models/ride";
import { NextRequest } from "next/server";

interface GetRequestContext {
    params: {
        rideId: string;
    };
};

export async function GET(request: NextRequest, { params }: GetRequestContext) {
    try {
        const ride = await getRide(params.rideId);
        if (!ride) return Response.json({ error: "Ride not found." }, { status: 404 });

        return Response.json({ ride }, { status: 200 });
    } catch(error) {
		console.error(error)
        return Response.json({ error }, { status: 500 });
    }
}
