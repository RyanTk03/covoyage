import { auth, clerkClient } from "@clerk/nextjs/server";
import { createUser, getUser } from "@/services/user";
import { addNotification } from "@/services/notification";
import { NotificationTypeCodeEnum } from "@/lib/constants";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { userId, sessionClaims } = auth();
		const body = await request.json();

		if (!userId) {
			return new Response("Clerk user not created", { status: 400 });
		}

		const client = clerkClient();
		let userCreated = null;

		if (sessionClaims.metadata.userRegistered) {
			return Response.json(
				{ message: 'unauthorized' },
				{ status: 403 }
			);
		}

		if (!sessionClaims.metadata.userRegistered) {
			userCreated = await createUser(body);
			if (userCreated) {
				addNotification(userId, {
					type: NotificationTypeCodeEnum.WELCOME,
				});
			}
		};

		await client.users.updateUser(userId, {
			publicMetadata: { userRegistered: true },
		});

		return Response.json(
			{ userRegistered: !!userCreated },
			{ status: 200 }
		);
	} catch (error) {
		console.error("User adding error:", error);
		return Response.json({ message: "Server error" }, { status: 500 });
	}
}
