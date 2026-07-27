import pool from "../config/db.js";
import { v4 as uuid } from "uuid";

export async function getMessages(conversationId) {

    const result = await pool.query(
        `
        SELECT *
        FROM messages
        WHERE conversation_id=$1
        ORDER BY created_at ASC
        `,
        [conversationId]
    );

    return result.rows;
}

export async function addMessage(
    conversationId,
    role,
    content
) {

    const id = uuid();

    const result = await pool.query(
        `
        INSERT INTO messages(
            id,
            conversation_id,
            role,
            content
        )
        VALUES($1,$2,$3,$4)
        RETURNING *;
        `,
        [
            id,
            conversationId,
            role,
            content
        ]
    );

    return result.rows[0];
}