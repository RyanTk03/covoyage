import { NextRequest } from "next/server";
import { addUserReview } from "@/services/reviews";
import { getAuthenticatedUser, getUser } from "@/services/user";

export async function POST(request: NextRequest) {
    try {
		const reviewer = await getAuthenticatedUser();
		if (!reviewer) {
			return Response.json({ error: "Your are not authorized" }, { status: 401 })
		}

        const body = await request.json();
		if (!body.reviewedId || !body.rating) {
			return Response.json({ error: !body.reviewedId ? "Reviewed user id missing" : "Missing user id" }, { status: 400 });
		}

		const reviewedUser = await getUser(body.reviewedId);
		if (!reviewedUser) {
			return Response.json({ error: "Reviewed user not found" }, { status: 404 });
		}

		const result = await addUserReview({
			comment: body.comment,
			rating: body.rating,
			reviewedId: reviewedUser.clerkId,
			reviewerId: reviewer.clerkId
		});

		return Response.json(result, { status: 201 });
    } catch (error) {
        console.error("Review creation failed:", error);
        return Response.json({ success: false, error: "Could not create review" }, { status: 500 });
    }
}
