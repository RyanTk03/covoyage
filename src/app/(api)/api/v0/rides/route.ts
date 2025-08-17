import { NextRequest } from "next/server";
import { addRide, getSearchedRides } from "@/services/ride";
import { RideStateCodeEnum } from "@/lib/constants";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
		const { userId } = auth();

		if (!userId) {
			return Response.json({ error: "No logged in user" }, { status: 401 });
		}
        const newRide = await addRide({
			userId,
			...body
		})

        return Response.json({ id: newRide._id }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const LIMIT = 50;
        const searchParams = request.nextUrl.searchParams;
        const step = parseInt(searchParams.get('step') || '0');
        const rideSearchParams = {
            departure: {
                city: searchParams.get('departureCity') || '',
                date: searchParams.get('departureDate') || '',
            },
            arrival: {
                city: searchParams.get('arrivalCity') || '',
            },
            ownerMinScore: parseFloat(searchParams.get('ownerMinScore') || '0'),
            transport: searchParams.get('transport') || undefined,
            maxTravellers: parseInt(searchParams.get('maxTravellers') || '-1') || undefined,
        }
        if (rideSearchParams.maxTravellers === -1) {
            delete rideSearchParams.maxTravellers;
        }
		if (rideSearchParams.transport === 'any') {
			delete rideSearchParams.transport;
		}
        const rides = await getSearchedRides(rideSearchParams, LIMIT, step);

        return Response.json({ rides }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 400 });
    }
}
