import { getNotifications } from "@/services/notification";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { userId } = auth();

		if (!userId) {
			return Response.json({ error: "User not found" }, { status: 401 });
		}

		const searchParams = request.nextUrl.searchParams;
		const isRead = searchParams.get('isRead');
		const step = parseInt(searchParams.get('step') || '0');

		const notifications = await getNotifications(userId, {
			isRead: isRead ? isRead === 'true' : null,
			step
		});

		return Response.json({ notifications }, { status: 200 });
	} catch (error: any) {
		console.error(error);
		return Response.json({ error: error.message }, { status: 500 });
	}
}