import { useEffect, useContext, useRef } from "react";
import { ChatContext } from "../../context/ChatContext";
import Message from "./Message";
import InputBox from "./InputBox";
import TypingIndicator from "./TypingIndicator";

import {
    sendMessage as sendMessageToAI,
    getConversations
} from "../../services/chatService";

export default function Chat() {
    const {
        setConversations,
        currentChat,
        isTyping,
        setIsTyping,
    } = useContext(ChatContext);

    const messages = currentChat?.messages || [];

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, isTyping]);

    if (!currentChat) {
        return (
            <div className="chat-container">
                <div
                    className="messages"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#999",
                        fontSize: "18px",
                    }}
                >
                    Select or create a conversation
                </div>

                <InputBox sendMessage={() => {}} />
            </div>
        );
    }

    const updateCurrentConversation = (newMessages) => {
        setConversations((prev) =>
            prev.map((chat) =>
                chat.id === currentChat.id
                    ? {
                          ...chat,
                          messages: newMessages,
                      }
                    : chat
            )
        );
    };

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        const updatedMessages = [
            ...messages,
            {
                role: "user",
                content: text,
            },
        ];

        updateCurrentConversation(updatedMessages);

        setIsTyping(true);

        try {
            const response = await sendMessageToAI(
                currentChat.id,
                text
            );

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let assistantText = "";
            let firstChunk = true;

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                assistantText += decoder.decode(value);

                if (firstChunk) {
                    setIsTyping(false);
                    firstChunk = false;
                }

                setConversations((prev) =>
                    prev.map((chat) => {
                        if (chat.id !== currentChat.id) return chat;

                        const copy = [...chat.messages];

                        if (
                            copy.length === 0 ||
                            copy[copy.length - 1].role !== "assistant"
                        ) {
                            copy.push({
                                role: "assistant",
                                content: assistantText,
                                streaming: true,
                            });
                        } else {
                            copy[copy.length - 1] = {
                                ...copy[copy.length - 1],
                                content: assistantText,
                                streaming: true,
                            };
                        }

                        return {
                            ...chat,
                            messages: copy,
                        };
                    })
                );
            }

            // Streaming finished
            setConversations((prev) =>
                prev.map((chat) => {
                    if (chat.id !== currentChat.id) return chat;

                    const copy = [...chat.messages];

                    if (
                        copy.length &&
                        copy[copy.length - 1].role === "assistant"
                    ) {
                        copy[copy.length - 1] = {
                            ...copy[copy.length - 1],
                            streaming: false,
                        };
                    }

                    return {
                        ...chat,
                        messages: copy,
                    };
                })
            );

            // Refresh sidebar titles from PostgreSQL
const updatedChats = await getConversations();

setConversations(prev =>
    updatedChats.map(chat => {
        const old = prev.find(c => c.id === chat.id);

        return {
            ...chat,
            messages: old?.messages || [],
        };
    })
);

        } catch (err) {
            console.error(err);

            setConversations((prev) =>
                prev.map((chat) => {
                    if (chat.id !== currentChat.id) return chat;

                    return {
                        ...chat,
                        messages: [
                            ...chat.messages,
                            {
                                role: "assistant",
                                content: "⚠️ Failed to connect to AI.",
                            },
                        ],
                    };
                })
            );
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}

                {isTyping && <TypingIndicator />}

                <div
                    ref={bottomRef}
                    style={{ height: "20px" }}
                />
            </div>

            <InputBox sendMessage={sendMessage} />
        </div>
    );
}