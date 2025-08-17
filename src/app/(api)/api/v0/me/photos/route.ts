import { getAuthenticatedUser } from "@/services/user";
import { getAuthenticatedUserPhotos } from "@/services/photo";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    try {
		const user = await getAuthenticatedUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const step = parseInt(request.nextUrl.searchParams.get('step') || '0');
        const photos = await getAuthenticatedUserPhotos(user._id, {
            step: step,
        });
        return Response.json({ photos }, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}