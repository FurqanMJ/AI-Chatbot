const API = "http://localhost:5000";

async function request(url, options = {}) {
    const response = await fetch(`${API}${url}`, options);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response;
}

// ---------------- Conversations ----------------

export async function getConversations() {
    const response = await request("/conversations");
    return response.json();
}

export async function createConversation(title = "New Chat") {
    const response = await request("/conversations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
    });

    return response.json();
}

export async function renameConversation(id, title) {
    console.log("PUT URL:", `${API}/conversations/${id}`);
    console.log("Title:", title);

    const response = await request(`/conversations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
    });

    return response.json();
}

export async function searchConversation(query){

    const response =
        await request(`/conversations/search?q=${query}`);

    return response.json();

}

// ---------------- Messages ----------------

export async function getMessages(conversationId) {
    const response = await request(`/messages/${conversationId}`);
    return response.json();
}


// ----------Delete------------

export async function deleteConversation(id){

    await request(`/conversations/${id}`,{

        method:"DELETE"

    });

}

// ---------------- AI Chat ----------------

export async function sendMessage(conversationId, message) {
    return request("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            conversationId,
            message,
        }),
    });
}