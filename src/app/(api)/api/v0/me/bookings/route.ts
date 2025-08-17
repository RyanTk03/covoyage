import { NextRequest } from "next/server";
import { bookRide, getUserBookings, userCanBook } from "@/services/booking";
import { getAuthenticatedUser } from "@/services/user";
import { getRide } from "@/services/ride";

export async function GET(request: NextRequest) {
    try {
		const authenticatedUser = await getAuthenticatedUser();

		if (!authenticatedUser) {
			return Response.json({ error: 'User not authenticated' }, { status: 401 })
		}

        const bookings = await getUserBookings(authenticatedUser.clerkId);

        return Response.json({ bookings }, { status: 200 });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

export async function POST(request: NextRequest, {params}) {
    try {
        const body = await request.json();
		if (!body.rideId) {
			return Response.json({ error: 'Missing ride id' }, { status: 400 });
		}

		const ride = await getRide(body.rideId);
		if (!ride) {
			return Response.json({ error: 'Ride to book not found' }, { status: 404 } )
		}

		const authenticatedUser = await getAuthenticatedUser();
		if (!authenticatedUser) {
			return Response.json({ error: 'User not authenticated' }, { status: 401 })
		}


		if (!(await userCanBook(authenticatedUser.clerkId, body.rideId))) {
			return Response.json({ error: 'You are not allowed to book' }, { status: 401 })
		}

		const booking = await bookRide(authenticatedUser.clerkId, ride);

        return Response.json({ booking }, { status: 201 });
    } catch (error) {
		console.error(error)
        return Response.json({ error }, { status: 500 });
    }
}