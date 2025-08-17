import { User, UserDoc } from "@/models/user";
import { connectToDatabase } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";

async function getUser(clerkId: string) {
    try {
        await connectToDatabase();
		const [clerkUser, dbUser] = await Promise.all([
			clerkClient().users.getUser(clerkId),
			User.findOne({ clerkId })
		]);

        return {
			...clerkUser,
			...dbUser._doc,
		};
    } catch (error: any) {
        throw error;
    }
}

async function createUser(data: UserDoc) {
    try {
        await connectToDatabase();
        const user = {
            clerkId: data.clerkId,
            gender: data.gender,
            birthday: data.birthday,
            description: data.description,
        };
        return await User.create<UserDoc>(user);
    } catch(error: any) {
        throw error;
    }
}

async function updateUser(clerkId: string, data: Partial<UserDoc>) {
    try {
        await connectToDatabase();
		delete data.clerkId;

        return await User.updateOne<UserDoc>({userId: clerkId}, {$set: data});
    } catch (error: any) {
        Error.captureStackTrace(error, updateUser);
        throw error;
    }
}

async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();
        const userId = clerkId;

        await User.deleteOne({userId});
		await clerkClient().users.deleteUser(clerkId);
    } catch(error: any) {
        throw error;
    }
}

async function getAuthenticatedUser() {
	const { userId } = auth();
	if (!userId) {
		return null;
	}

	return await getUser(userId);
}

export {
    createUser,
    updateUser,
    deleteUser,
    getUser,
	getAuthenticatedUser,
};
