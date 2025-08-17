import mongoose from "mongoose";
import { TransportCodeEnum } from "@/lib/constants";

const transportSchema = new mongoose.Schema({
    code: {
        type: mongoose.Schema.Types.String,
        enum: Object.values(TransportCodeEnum),
        unique: true,
		required: true,
    },
    label: {
        type: mongoose.Schema.Types.String,
		required: true,
    },
});

export type TransportDoc = mongoose.InferSchemaType<typeof transportSchema>;

const Transport = mongoose.models.Transport || mongoose.model('Transport', transportSchema);

export { Transport, transportSchema };
