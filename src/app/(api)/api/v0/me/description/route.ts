import { getAuthenticatedUser, updateUser } from "@/services/user";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		const authenticatedUser = await getAuthenticatedUser();
	    const body = await request.json();

	    if (!authenticatedUser) return Response.json({ error: "Not allowed." }, { status: 401 });

	    await updateUser(authenticatedUser.id, body);

	    return Response.json({
	        message: "user updated successfully",
	        modifiedCount: 1,
	    }, { status: 200 });
	} catch (error: any) {
	    console.error(error);
	    return Response.json({ error: error.message, status: 400 });
	}
}