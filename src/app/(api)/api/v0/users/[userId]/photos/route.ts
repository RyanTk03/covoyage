import { backendClient } from "@/lib/edgestore/backend";
import { getUserPhotos } from "@/services/photo";
import { getUser } from "@/services/user";
import { NextRequest } from "next/server";

interface RequestContest {
  params: {
      userId: string
  }
}

export async function GET(request: NextRequest, { params }: RequestContest) {
    try {
        const urlParams = request.nextUrl.searchParams;
        const step = parseInt(urlParams.get('step') || '0');
        const limit = parseInt(urlParams.get('limit') || '25');

        if (!params.userId) {
            return Response.json({ error: "User id missing" }, { status: 400 });
        }

        const user = await getUser(params.userId);
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        // const photos = await getUserPhotos(user._id, {
        //     step: step,
        // });
		const photos = await backendClient.travels.listFiles({
			filter: {
				path: {
					author: params.userId,
				}
			},
			pagination: {
				currentPage: step + 1,
				pageSize: limit,
			},
		})
        return Response.json({photos}, {status: 200});
    } catch (error) {
        return Response.json({error}, {status: 400})
    }
}