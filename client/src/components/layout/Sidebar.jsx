import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { FaPlus } from "react-icons/fa";
import {
    createConversation,
    getMessages,
    deleteConversation,
    renameConversation
} from "../../services/chatService";

import { FaTrash } from "react-icons/fa";

export default function Sidebar() {

    const {

        conversations,
        setConversations,

        currentChatId,
        setCurrentChatId

    } = useContext(ChatContext);

    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [search, setSearch] = useState("");

const newChat = async () => {

    try {

        const chat = await createConversation();
        console.log(chat);

        const messages = await getMessages(chat.id);

        chat.messages = messages;

        setConversations(prev => [chat, ...prev]);

        setCurrentChatId(chat.id);

    } catch (err) {

        console.error(err);

    }

};

    return (

        <div className="sidebar">

            <button 
                className="new-chat"
                onClick={newChat}
            >
                <FaPlus />
                New Chat
            </button>

            <input
    className="search-box"
    placeholder="Search..."
    value={search}
    onChange={(e)=>setSearch(e.target.value)}
/>

            <div className="history">

                {
                    conversations
.filter(chat =>
    chat.title
    .toLowerCase()
    .includes(search.toLowerCase())
).map(chat => (
                        <div
            key={chat.id}
            className={`history-item ${
                currentChatId === chat.id ? "active" : ""
            }`}
            onClick={async () => {

                try {

                    const messages = await getMessages(chat.id);

                    setConversations(prev =>
                        prev.map(c =>
                            c.id === chat.id
                                ? { ...c, messages }
                                : c
                        )
                    );

                    setCurrentChatId(chat.id);

                } catch (err) {
                    console.error(err);
                }

            }}
        >
            {
    editingId === chat.id ? (

        <input
            autoFocus
            value={editingTitle}
            onChange={(e) =>
                setEditingTitle(e.target.value)
            }

            onBlur={async () => {

                if (editingTitle.trim()) {

                    await renameConversation(
                        chat.id,
                        editingTitle
                    );

                    setConversations(prev =>
                        prev.map(c =>
                            c.id === chat.id
                                ? {
                                      ...c,
                                      title: editingTitle,
                                  }
                                : c
                        )
                    );
                }

                setEditingId(null);
            }}

            onKeyDown={(e) => {

                if (e.key === "Enter") {
                    e.target.blur();
                }

            }}

        />

    ) : (

        <span
            onDoubleClick={() => {

                setEditingId(chat.id);

                setEditingTitle(chat.title);

            }}
        >
            {chat.title}
        </span>

    )
}

    <FaTrash

        className="delete"

        onClick={async(e)=>{

            e.stopPropagation();

            if(!confirm("Delete this conversation?"))
                return;

            await deleteConversation(chat.id);

            setConversations(prev=>

                prev.filter(c=>c.id!==chat.id)

            );

        }}

    />

</div>
                    ))
                }
            </div>
        </div>
    );
}