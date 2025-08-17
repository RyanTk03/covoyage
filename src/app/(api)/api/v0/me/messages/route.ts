import { NextRequest } from "next/server";
import { sendMessage } from "@/services/message";
import { getUser, getAuthenticatedUser } from "@/services/user";

export async function POST(request: NextRequest) {
    try {
        const foundSender = await getAuthenticatedUser();
        if (!foundSender) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

        const body = await request.json();
        const foundReceiver = await getUser(body.receiver);
        if (!foundReceiver || !body.message) {
			return Response.json({ error: !foundReceiver ? "Receiver user id missing" : "Message to send cannot be empty" }, { status: 400 });
		}
        await sendMessage({
            sender: foundSender,
            receiver: foundReceiver,
            message: body.message,
        });

        return Response.json({ message: "New message sent." }, { status: 201 });
    } catch (error: any) {
        console.error('error:', error)
        return Response.json({ error: error.message }, { status: 500 });
    }
}