import { acceptBooking, rejectBooking } from '@/services/booking';
import { getAuthenticatedUser } from '@/services/user';

export async function POST(request: Request, { params }) {
	const { rideId, bookingId, action } = params;
	const user = await getAuthenticatedUser();

	try {
		if (!user) return new Response("Unauthorized", { status: 401 });

		if (action === 'accept') {
			const booking = await acceptBooking(rideId, bookingId, user.clerkId);
			return new Response(JSON.stringify(booking), { status: 200 });
		} else if (action === 'reject') {
			const booking = await rejectBooking(rideId, bookingId, user.clerkId);
			return new Response(JSON.stringify(booking), { status: 200 });
		} else {
			return new Response("Invalid action", { status: 400 });
		}
	} catch (error: any) {
		console.error(error);
		return new Response(error?.message || "Internal Server Error", { status: 500 });
	}
}