import { updateUserReview } from "@/services/reviews";
import { getAuthenticatedUser, getUser } from "@/services/user";
import { NextRequest } from "next/server";


export async function PUT(request: NextRequest, { params }) {
    try {
		const { clerkId: reviewer } = await getAuthenticatedUser();
		if (!reviewer) {
			return Response.json({ error: "Your are not authorized" }, { status: 401 })
		}

        const body = await request.json();
		if (!body.reviewedId || !body.rating) {
			return Response.json({ error: !body.reviewedId ? "Reviewed user id missing" : "Missing user rating" }, { status: 400 });
		}

		const reviewedUser = await getUser(body.reviewedUser);
		if (!reviewedUser) {
			return Response.json({ error: "Reviewed user not found" }, { status: 404 });
		}

		const result = await updateUserReview(params.reviewId, {
			comment: body.comment,
			rating: body.rating,
			reviewedId: reviewedUser.clerkId,
			reviewerId: reviewer
		});

		return Response.json(result, { status: 201 });
    } catch (error) {
        console.error("Review creation failed:", error);
        return Response.json({ success: false, error: "Could not create review" }, { status: 500 });
    }
}
