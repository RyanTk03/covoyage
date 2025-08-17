import { NextRequest } from "next/server";
import { getUser } from "@/services/user";
import { addNotification, getNotifications } from "@/services/notification";
import { NotificationStateCodeEnum } from "@/lib/constants";

interface RequestContest {
    params: {
        userId: string
    }
}

export async function POST(request: NextRequest, { params }: RequestContest) {
    try {
        const body = await request.json();
        const user = await getUser(params.userId);
        if (!user) return Response.json({ error: "Invalid notification receiver." }, { status: 400 });
        
        const notification = await addNotification(user._id, body.type);

        return Response.json({ message: "New notifications added.", notification }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(request: NextRequest, { params }: RequestContest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const isRead = searchParams.get('isRead');
        const step = parseInt(searchParams.get('step') || '0');
        const user = await getUser(params.userId);
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const notifications = await getNotifications(user._id, {
            isRead: isRead ? isRead === 'true' : null,
            step
        });

        return Response.json({ notifications }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 400 });
    }
}

