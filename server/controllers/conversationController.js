import {
    getAllConversations,
    createConversation,
    deleteConversation,
    updateConversationTitle,
    searchConversations
} from "../models/conversationModel.js";

export async function getConversations(req, res) {

    const conversations =
        await getAllConversations();

    res.json(conversations);

}

export async function newConversation(req, res) {

    const { title } = req.body;

    const conversation =
        await createConversation(title);

    res.json(conversation);

}

export async function renameConversation(req, res) {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const conversation = await updateConversationTitle(id, title);

        res.json(conversation);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to rename conversation"
        });
    }
}

export async function removeConversation(req, res) {

    try {

        const { id } = req.params;

        const { deleteConversation } =
            await import("../models/conversationModel.js");

        await deleteConversation(id);

        res.json({
            success: true
        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            error:"Failed"
        });

    }

}

export async function searchConversation(req, res) {

    const { q } = req.query;

    const { searchConversations } =
        await import("../models/conversationModel.js");

    const conversations =
        await searchConversations(q || "");

    res.json(conversations);
}