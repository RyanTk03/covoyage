import { RideStateCodeEnum } from "@/lib/constants";
import { Ride } from "@/models/ride";
import { updateRide } from "@/services/ride";
import { getAuthenticatedUser } from "@/services/user";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { rideId: string } }) {
    try {
        const body = await request.json();
        await updateRide(params.rideId, body);

        return Response.json({ message: "Ride updated." }, { status: 200 });
    } catch (error) {
        return Response.json({ error }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { travel: string } }) {
    try {
        await Ride.findOneAndUpdate({_id: params.travel}, {$set: {state: RideStateCodeEnum.CLOSED}});
    
        return Response.json({message: "travel deleted"}, {status: 200});
    } catch (error) {
        return Response.json({error}, {status: 400});
    }
}
