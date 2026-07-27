import { addMessage } from "../models/messageModel.js";

export async function saveUserMessage(req, res) {
    try {
        const { conversationId, content } = req.body;

        const message = await addMessage(
            conversationId,
            "user",
            content
        );

        res.json(message);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to save message"
        });
    }
}

export async function getConversationMessages(req, res) {
    try {

        const { conversationId } = req.params;

        const { getMessages } = await import("../models/messageModel.js");

        const messages = await getMessages(conversationId);

        res.json(messages);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Failed"
        });

    }
}