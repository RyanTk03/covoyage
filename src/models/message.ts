import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: mongoose.Schema.Types.String,
        minlength: 2,
        maxlength: 4000,
    },
    sentAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    },
});

export type MessageDoc = mongoose.InferSchemaType<typeof messageSchema>;

const Message = mongoose.models.Message || mongoose.model<MessageDoc>('Message', messageSchema);

export { Message, messageSchema };
