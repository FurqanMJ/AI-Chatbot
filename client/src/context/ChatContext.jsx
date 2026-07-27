import { createContext, useState } from "react";

import { useEffect } from "react";

import { getConversations } from "../services/chatService";

export const ChatContext = createContext();


export function ChatProvider({ children }) {
    const [conversations, setConversations] = useState([]);

    const [isTyping, setIsTyping] = useState(false);

    const [currentChatId, setCurrentChatId] = useState(null);

    const currentChat =
        conversations.find(c => c.id === currentChatId) || null;

    useEffect(() => {

        async function loadConversations() {

            try {

                const data = await getConversations();

                const chats = data.map(chat => ({
                    ...chat,
                    messages: []
                }));

                setConversations(chats);

                if (chats.length > 0) {
                    setCurrentChatId(chats[0].id);
                }

            } catch (err) {

                console.error("Failed to load conversations", err);

            }
        }

        loadConversations();

    }, []);

    return (
        <ChatContext.Provider
            value={{
                conversations,
                setConversations,

                currentChat,

                currentChatId,
                setCurrentChatId,

                isTyping,
                setIsTyping
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}