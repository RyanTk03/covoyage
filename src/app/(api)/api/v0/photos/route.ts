import { getUser } from "@/services/user";
import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { addRidePhoto, getUserPhotos } from "@/services/photo";

interface RequestContest {
    params: {
        rideId: string
    }
}

export async function GET(request: NextRequest, { params }: RequestContest) {
    try {
        const urlParams = request.nextUrl.searchParams;
        const LIMIT = 50;
        const step = parseInt(urlParams.get('step') || '0');
        const userId = urlParams.get('userId');

        if (!userId) {
            return Response.json({ error: "User id missing" }, { status: 400 });
        }

        const user = await getUser(userId);
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        const photos = await getUserPhotos(user._id, {
            step: step,
        });
        return Response.json({photos}, {status: 200});
    } catch (error) {
        return Response.json({error}, {status: 400})
    }
}

export async function POST(request: NextRequest, { params }: RequestContest) {
    try {
        await connectToDatabase();
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;
        const uploaderId = data.get('uploaderId') as string;

        if (!file || !uploaderId) {
            return NextResponse.json({ error: "File not uploaded" }, { status: 400 });
        }

        const user = await getUser(uploaderId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const photo = addRidePhoto({
            rideId: params.rideId,
            uploaderId: user._id,
            file,
        });

        return NextResponse.json({ photo }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "" }, { status: 400 });
    }
}
