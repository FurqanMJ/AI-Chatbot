import pool from "../config/db.js";
import { v4 as uuid } from "uuid";

export async function getAllConversations() {
    const result = await pool.query(`
        SELECT *
        FROM conversations
        ORDER BY created_at DESC
    `);

    return result.rows;
}

export async function createConversation(title = "New Chat") {

    const id = uuid();

    const result = await pool.query(
        `
        INSERT INTO conversations(id, title)
        VALUES($1, $2)
        RETURNING *;
        `,
        [id, title]
    );

    return result.rows[0];
}

export async function updateConversationTitle(id, title) {

    const result = await pool.query(
        `
        UPDATE conversations
        SET title=$1
        WHERE id=$2
        RETURNING *;
        `,
        [title, id]
    );

    return result.rows[0];
}

export async function deleteConversation(id) {

    await pool.query(
        `
        DELETE FROM conversations
        WHERE id=$1
        `,
        [id]
    );

}

export async function searchConversations(query) {

    const result = await pool.query(
        `
        SELECT *
        FROM conversations
        WHERE LOWER(title)
        LIKE LOWER($1)
        ORDER BY created_at DESC
        `,
        [`%${query}%`]
    );

    return result.rows;
}