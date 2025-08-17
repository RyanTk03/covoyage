import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/message";
import { addNotification } from "./notification";
import { NotificationTypeCodeEnum } from "@/lib/constants";
import emailjs from '@emailjs/nodejs'
import { getUser } from "./user";

async function sendMessage(data) {
    try {
        await connectToDatabase();

        const messageData = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                receiver_username: data.receiver.username,
                receiver_email: data.receiver.primaryEmailAddress?.emailAddress ?? data.receiver.emailAddresses[0].emailAddress,
                sender_username: data.sender.username,
                app_email: process.env.EMAIL_ADDRESS,
                app_name: process.env.APP_NAME,
                message: data.message,
                action: `localhost:3000/dashboard/sendMessage`
            }
        };

		const emailResponse = await emailjs.send(messageData.service_id!, messageData.template_id!, messageData.template_params, {
			publicKey: messageData.user_id,
			privateKey: messageData.accessToken,
		});
        if (emailResponse.status >= 400) {
            throw new Error(emailResponse.text);
        }
        const message = await Message.create({
			sender: data.sender._id,
			receiver: data.receiver._id,
			message: data. message
		});
        await addNotification(data.receiver.id, {
			type: NotificationTypeCodeEnum.NEW_MESSAGE
		});

        return message;
    } catch(error: any) {
        Error.captureStackTrace(error, sendMessage);
        throw error;
    }
}

export { sendMessage };
