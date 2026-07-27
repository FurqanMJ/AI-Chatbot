import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy, FaCheck } from "react-icons/fa";

export default function CodeBlock({
    inline,
    className,
    children,
    ...props
}) {
    const [copied, setCopied] = useState(false);

    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "text";

    const code = String(children).replace(/\n$/, "");

    const copy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
    };

    if (inline) {
        return (
            <code className="inline-code">
                {children}
            </code>
        );
    }

    return (
        <div className="code-container">

            <div className="code-header">

                <span>{language}</span>

                <button onClick={copy}>
                    {copied ? <FaCheck /> : <FaCopy />}
                </button>

            </div>

            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    borderRadius: "0 0 12px 12px",
                    fontSize: "15px",
                    padding: "18px",
                }}
                {...props}
            >
                {code}
            </SyntaxHighlighter>

        </div>
    );
}