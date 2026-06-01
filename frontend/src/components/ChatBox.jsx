

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Message from "./Message";
import Loader from "./Loader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const REQUEST_TIMEOUT_MS = 35000;

const USER_NAME = import.meta.env.VITE_USER_NAME || "Sreeja";

const SUGGESTIONS = [
  "Plan my day for me ☀️",
  "Help me draft an email ✉️",
  "Summarize this for me 📝",
  "Give me a few dinner ideas 🍝",
  "Help me make a decision 🤔",
  "Write something for me ✍️",
  "Explain this simply 💡",
  "Brainstorm ideas with me 🧠",
];

export default function ChatBox() {
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [persistMemory, setPersistMemory] = useState(() => {
    const saved = localStorage.getItem("persistMemory");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (persistMemory) {
      const stored = localStorage.getItem("chatMessages");
      if (stored) {
        try {
          setMessages(JSON.parse(stored));
        } catch (_) {}
      }
    }
  }, [persistMemory]);

  useEffect(() => {
    if (persistMemory) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } else {
      localStorage.removeItem("chatMessages");
    }
  }, [messages, persistMemory]);

  const handleNewChat = () => {
    setMessages([]);
    setError("");
    if (persistMemory) localStorage.removeItem("chatMessages");
  };

  const handleDeleteMessage = (idx) => {
    setMessages((prev) => prev.filter((_, i) => i !== idx));
  };

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleChange = (e) => {
    setInput(e.target.value);
    if (error) setError("");
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setError("");
    const userMsg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/chat`,
        { messages: nextMessages },
        { timeout: REQUEST_TIMEOUT_MS }
      );
      if (!data?.reply) throw new Error("Empty reply from server.");
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (err) {
      console.error("Request failed:", err);

      setMessages(messages);

      setInput(trimmed);
      if (textareaRef.current) {
        
        setTimeout(() => {
          const ta = textareaRef.current;
          if (ta) {
            ta.style.height = "auto";
            ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
          }
        }, 0);
      }

      const serverError = err.response?.data?.error;
      const isTimeout = err.code === "ECONNABORTED";
      setError(
        serverError ||
          (isTimeout
            ? "The request timed out. Please try again."
            : "Could not reach the server. Is the backend running on the configured port?")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {}
      <div className="chat-header">
        <button className="new-chat-btn" onClick={handleNewChat}>
          New Chat
        </button>
        <label className="memory-toggle">
          <input
            type="checkbox"
            checked={persistMemory}
            onChange={() => setPersistMemory((p) => !p)}
          />
          Memory Storage
        </label>
      </div>

      {}
      <div className="chatbox">
        {messages.length === 0 && !loading ? (
          <div className="welcome">
            <div className="welcome-logo">🤖</div>
            <h2>Hey {USER_NAME} 👋 How can I help you today?</h2>
            <p>
              I'm your personal assistant, {USER_NAME} — here to help you plan,
              write, decide, learn, and get things done. Just ask away!
            </p>
            <div className="groq-tag">⚡ Your personal assistant</div>
            <div className="suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-btn"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <Message key={i} role={msg.role} content={msg.content} onDelete={() => handleDeleteMessage(i)} />
            ))}
            {loading && <Loader />}
            {error && (
              <div className="error-box">
                <span>⚠️ {error}</span>
                <button className="clear-error-btn" onClick={() => setError("")} title="Dismiss error">×</button>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <div className="input-box">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything…"
            rows={1}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            title="Send message"
          >
            ➤
          </button>
        </div>
        <p className="input-hint">Enter to send &nbsp;·&nbsp; Shift+Enter for new line</p>
      </div>
    </>
  );
}
