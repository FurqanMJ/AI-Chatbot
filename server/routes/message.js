import express from "express";

import {
    saveUserMessage,
    getConversationMessages
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("✅ Message router works!");
});

router.post("/", saveUserMessage);

router.get("/:conversationId", getConversationMessages);

export default router;