# 🤖 Groq AI Chatbot

Full-stack AI chatbot using **React + Vite** (frontend) and **Node.js + Express** (backend), powered by the **Groq API** (groq.com) with OpenAI's **GPT-OSS 20B** model (configurable via `GROQ_MODEL`).

Features: conversation memory (full history is sent each turn), markdown-rendered replies (code blocks, lists, tables), request timeouts, and meaningful error handling.

---

## 📁 Folder Structure

```
groq-chatbot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx   ← Main chat interface
│   │   │   ├── Message.jsx   ← Message bubble
│   │   │   └── Loader.jsx    ← Typing animation
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                  ← VITE_API_URL
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── server.js             ← Express + Groq API
│   ├── .env                  ← GROQ_API_KEY
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup

### Step 1 — Get FREE Groq API Key
1. Go to 👉 https://console.groq.com/keys
2. Sign in / Create account
3. Click **"Create API Key"**
4. Copy the key (starts with `gsk_...`)

### Step 2 — Add key to backend/.env
Copy `backend/.env.example` to `backend/.env` and set your key:
```
GROQ_API_KEY=gsk_your_key_here   # starts with gsk_, ~56 chars
PORT=5001
```
> ⚠️ The key must be the **full** key copied from the Groq console. A truncated key returns `401 Invalid API Key`.

### Step 3 — Run Backend
```bash
cd backend
npm install
npm run dev
```

### Step 4 — Run Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 5 — Open browser
```
http://localhost:5173
```

---

## 🔌 API

**POST** `/chat`

Single message:
```json
{ "message": "What is AI?" }
```
Or full conversation (enables memory):
```json
{ "messages": [
  { "role": "user", "content": "What is AI?" },
  { "role": "bot",  "content": "AI is..." },
  { "role": "user", "content": "Give an example" }
] }
```
Response: `{ "reply": "AI is..." }`
Errors: `{ "error": "message", "code": "ERROR_CODE" }` with appropriate HTTP status.

**GET** `/health` → `{ "ok": true, "model": "llama-3.1-8b-instant" }`

---

## 🛠️ Tech Stack

| Layer    | Tech                    |
|----------|-------------------------|
| Frontend | React 18, Vite, Axios, react-markdown |
| Backend  | Node.js, Express        |
| AI       | Groq API, OpenAI GPT-OSS 20B |
| Styling  | Pure CSS                |
