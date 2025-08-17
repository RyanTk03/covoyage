import { getTransports } from "@/services/transport";

export async function GET() {
    try {
        const transports = await getTransports();

        return Response.json({ transports }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
