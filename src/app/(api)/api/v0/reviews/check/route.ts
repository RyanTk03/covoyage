import { userAlreadyReview, userCanReview } from "@/services/reviews";
import { getAuthenticatedUser } from "@/services/user";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const reviewer = await getAuthenticatedUser();
		if (!reviewer) {
			return Response.json({ canReview: false });
		}

        const reviewed = request.nextUrl.searchParams.get('reviewedId');
		if (!reviewed) {
			return Response.json({ canReview: false });
		}

		const canReview = await userCanReview(reviewed, reviewer.clerkId);
		const alreadyReview = await userAlreadyReview(reviewed, reviewer.clerkId);

		return Response.json({ canReview, alreadyReview }, { status: 200 });
	} catch (error) {
		console.error(error);
		return Response.json({ error: "Server error" }, { status: 500 })
	}
}