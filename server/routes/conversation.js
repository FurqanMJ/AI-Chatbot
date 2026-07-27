import express from "express";

import {

    getConversations,
    newConversation,
    removeConversation,
    renameConversation,
    searchConversation

} from "../controllers/conversationController.js";

const router = express.Router();

router.get("/", getConversations);

router.post("/", newConversation);

router.delete("/:id", removeConversation);

router.put("/:id", renameConversation);

router.get("/search", searchConversation);

export default router;