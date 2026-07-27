import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";
import MessageActions from "./MessageActions";

export default function Message({ message }) {
    return (
        <div className={`message ${message.role}`}>

            <div className="avatar">
                {message.role === "assistant" ? "🤖" : "🙂"}
            </div>

            <div className="content">

    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            code({ inline, className, children, ...props }) {
                return (
                    <CodeBlock
                        inline={inline}
                        className={className}
                        {...props}
                    >
                        {children}
                    </CodeBlock>
                );
            },
        }}
    >
        {message.content}
    </ReactMarkdown>

</div>

<MessageActions message={message} />

        </div>
    );
}