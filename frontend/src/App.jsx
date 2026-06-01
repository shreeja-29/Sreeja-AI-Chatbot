

import ChatBox from "./components/ChatBox";

const USER_NAME = import.meta.env.VITE_USER_NAME || "Sreeja";

export default function App() {
  return (
    <div className="app">

      {}
      <header className="header">
        <div className="header-logo">🤖</div>

        <div className="header-info">
          <div className="header-title">{USER_NAME}'s Personal Assistant</div>
          <div className="header-sub">Always here to help you</div>
        </div>

        <div className="header-badge">
          <span className="badge-dot" />
          Online
        </div>
      </header>

      <ChatBox />

    </div>
  );
}
