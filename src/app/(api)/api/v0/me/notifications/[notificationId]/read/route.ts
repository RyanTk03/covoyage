import { NextRequest } from "next/server";
import { getAuthenticatedUser, getUser } from "@/services/user";
import { readNotification } from "@/services/notification";

interface RequestContest {
    params: {
        notificationId: string
    }
}

export async function PATCH(request: NextRequest, { params }: RequestContest) {
	try {
		const user = await getAuthenticatedUser();
		if (!user) {
			return Response.json({ error: "Not allower." }, { status: 401 });
		}

		const notifications = await readNotification(user.clerkId!, params.notificationId);

		return Response.json({
			message: `${notifications.modifiedCount} notification(s) updated`,
			modifiedCount: notifications.modifiedCount,
		}, { status: 200 });
	} catch (error: any) {
		console.error(error);
		return Response.json({ error: error.message }, { status: 400 });
	}
}