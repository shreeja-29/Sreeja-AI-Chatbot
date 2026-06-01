

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message({ role, content, onDelete }) {
  const isUser = role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "bot"}`}>
      {}
      <div className={`avatar ${isUser ? "user-avatar" : "bot-avatar"}`}>{isUser ? "👤" : "🤖"}</div>

      {}
      <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
        {isUser ? (
          
          content.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))
        ) : (
          
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
        {isUser && onDelete && (
          <button className="delete-btn" onClick={onDelete} aria-label="Delete message">🗑️</button>
        )}
      </div>
    </div>
  );
}
