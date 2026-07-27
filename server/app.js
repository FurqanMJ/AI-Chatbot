import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import messageRoutes from "./routes/message.js";
import conversationRoutes from "./routes/conversation.js";
import { addMessage, getMessages } from "./models/messageModel.js";
import { updateConversationTitle } from "./models/conversationModel.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/messages", messageRoutes);
app.use("/conversations", conversationRoutes);

app.post("/chat", async (req, res) => {
    try {
        const { conversationId, message } = req.body;

        if (!conversationId || !message) {
            return res.status(400).json({
                error: "conversationId and message are required",
            });
        }

        // Load previous messages
        const previousMessages = await getMessages(conversationId);

        // Save user message
        await addMessage(
            conversationId,
            "user",
            message
        );

        // Conversation history for Ollama
        const ollamaMessages = [
            ...previousMessages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
            {
                role: "user",
                content: message,
            },
        ];

        const ollamaResponse = await fetch(
            "http://localhost:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama3.2",
                    messages: ollamaMessages,
                    stream: true,
                }),
            }
        );

        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");

        const reader = ollamaResponse.body.getReader();
        const decoder = new TextDecoder();

        let assistantText = "";

        // Stream AI response
        while (true) {

            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value);

            const lines = chunk
                .split("\n")
                .filter(line => line.trim());

            for (const line of lines) {

                try {

                    const json = JSON.parse(line);

                    if (json.message?.content) {

                        assistantText += json.message.content;

                        res.write(json.message.content);

                    }

                } catch (err) {

                    console.error(err);

                }

            }

        }

        // Save assistant message
        await addMessage(
            conversationId,
            "assistant",
            assistantText
        );

        // Current conversation title
        const result = await pool.query(
            `
            SELECT title
            FROM conversations
            WHERE id = $1
            `,
            [conversationId]
        );

        const currentTitle = result.rows[0].title;

        // Generate title only once
        if (currentTitle === "New Chat") {

            const titleResponse = await fetch(
                "http://localhost:11434/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "llama3.2",
                        stream: false,
                        messages: [
                            {
                                role: "system",
                                content:
                                    "Generate a short conversation title (maximum 5 words). Reply ONLY with the title."
                            },
                            {
                                role: "user",
                                content: message
                            }
                        ]
                    })
                }
            );

            const titleJson = await titleResponse.json();

            if (titleJson.message?.content) {

                const aiTitle =
                    titleJson.message.content.trim();

                await updateConversationTitle(
                    conversationId,
                    aiTitle
                );

                console.log(
                    "Conversation renamed:",
                    aiTitle
                );

            }

        }

        // Finish the stream
        res.end();

    } catch (err) {

        console.error(err);

        if (!res.headersSent) {

            res.status(500).json({
                error: "Server Error",
            });

        } else {

            res.end();

        }

    }
});

const PORT = process.env.PORT || 5000;

console.log("Message routes loaded");
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});