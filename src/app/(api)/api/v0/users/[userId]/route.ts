import { NextRequest } from "next/server";
import { getUser } from "@/services/user";

interface RequestContest {
    params: {
        userId: string
    }
}

export async function GET(request: NextRequest, { params }: RequestContest) {
    try {
        const userId = params.userId;

        if (!userId) {
            return Response.json({ error: "User id missing" }, { status: 400 });
        }

        const user = await getUser(userId);
        return Response.json({ user }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 400 });
    }
}

// TODO: Handle user updating request 
export async function PUT(request: NextRequest, { params }: RequestContest) {
    // try {
    //     const body = await request.json();
    //     const user = await getUser(params.userId);

    //     if (!user) return Response.json({ error: "User not found." }, { status: 404 });

    //     user.description = body.description;
    //     await user.save();

    //     return Response.json({
    //         message: "user updated successfully",
    //         modifiedCount: 1,
    //     }, { status: 200 });
    // } catch (error: any) {
    //     console.error(error);
    //     return Response.json({ error: error.message, status: 400 });
    // }
}