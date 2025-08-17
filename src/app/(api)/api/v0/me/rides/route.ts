import { getAuthenticatedUser } from "@/services/user";
import { getUserRides } from "@/services/ride";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
		const user = await getAuthenticatedUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

		const state = request.nextUrl.searchParams.get('state');
        const rides = await getUserRides(user.clerkId, state);
        return Response.json({ rides }, { status: 200 });
    } catch (error) {
        return Response.json({ error }, { status: 400 });
    }
}