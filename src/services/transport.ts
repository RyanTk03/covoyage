import { Transport } from "@/models/transport";
import { connectToDatabase } from "@/lib/db";

async function getTransports() {
    try {
        await connectToDatabase();
        const transports = await Transport.find();

        return transports;
    } catch(error: any) {
        throw error;
    }
}

export { getTransports };
