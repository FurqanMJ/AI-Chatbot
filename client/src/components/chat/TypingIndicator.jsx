export default function TypingIndicator() {
    return (
        <div className="message assistant">
            <div className="avatar">🤖</div>

            <div className="content">
                <div className="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}