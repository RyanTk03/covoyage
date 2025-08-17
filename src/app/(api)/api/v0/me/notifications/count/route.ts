import { NotificationStateCodeEnum } from "@/lib/constants";
import { getNotificationsCount } from "@/services/notification";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    try {
		const { userId } = auth();

		if (!userId) {
			return Response.json({ error: "No logged in user" }, { status: 401 });
		}
        const searchParams = request.nextUrl.searchParams;
        const isRead = searchParams.get('isRead');

        const counts = await getNotificationsCount(userId, isRead ? Boolean(isRead) : null);

        return Response.json({ counts }, { status: 200 });
    } catch (error: any) {
        console.error(error.stack);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
