import { NextRequest } from "next/server";
import { getUserReviews } from "@/services/reviews";
import { getUser } from "@/services/user";

export async function GET(request: NextRequest, { params }) {
    try {
		if (!params.userId) {
			return Response.json({ error: "Missing user id" }, { status: 400 });
		}

		const user = await getUser(params.userId);
		if (!user) {
			return Response.json({ error: "User not found" }, { status: 404 });
		}

        const step = parseInt(params.step || '0');
		const reviews = await getUserReviews(params.userId, { step });

        return Response.json({ reviews }, { status: 200 });
    } catch (error: any) {
		console.error(error)
        return Response.json({ error: error.message }, { status: 500 });
    }
}
