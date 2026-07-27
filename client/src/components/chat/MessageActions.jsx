import { FaCopy, FaRedo, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useState } from "react";

export default function MessageActions({ message }) {

    const [copied, setCopied] = useState(false);

    const copyMessage = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="message-actions">

            <button onClick={copyMessage}>
                {copied ? "✓" : <FaCopy />}
            </button>

            {message.role === "assistant" && (
                <>
                    <button title="Regenerate">
                        <FaRedo />
                    </button>

                    <button title="Good response">
                        <FaThumbsUp />
                    </button>

                    <button title="Bad response">
                        <FaThumbsDown />
                    </button>
                </>
            )}

        </div>
    );
}