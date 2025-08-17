import { closeRide } from "@/services/ride";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { rideId: string } }) {
	try {
		await closeRide(params.rideId);

		return Response.json({ message: "Ride closed." }, { status: 200 });
	} catch (error) {
		console.error(error)
		return Response.json({ error }, { status: 500 });
	}
}