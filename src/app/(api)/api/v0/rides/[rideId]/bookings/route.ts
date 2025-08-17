import { NextRequest } from "next/server";
import { getRideBookings } from "@/services/booking";
import { getAuthenticatedUser } from "@/services/user";
import { getRide } from "@/services/ride";

export async function GET(request: NextRequest, { params }: { params: { rideId: string } }) {
	try {
		const authenticatedUser = await getAuthenticatedUser();
		if (!authenticatedUser) {
			return Response.json({ error: 'User not authenticated' }, { status: 401 });
		}

		const ride = await getRide(params.rideId);
		if (!ride) {
			return Response.json({ error: 'Ride not found' }, { status: 404 });
		}

		const bookings = await getRideBookings(params.rideId, true);

		return Response.json({ bookings }, { status: 200 });
	} catch (error) {
		console.error(error)
		return Response.json({ error }, { status: 500 });
	}
}
