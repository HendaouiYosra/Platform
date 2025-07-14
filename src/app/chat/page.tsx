"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./ChatPage.module.css";
import HistorySidebar from "../../../components/HistorySidebar";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
type Message = {
  role: "user" | "bot";
  content: string;
};

type ChatSession = {
  id: string;
  name: string;
  model: "qwen" | "gemini" | "gpt";
  messages: Message[];
};

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const selectedModel = activeSession?.model || "gemini";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content: string, role: "user" | "bot") => {
    if (!activeSessionId) return;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, { role, content }] }
          : s
      )
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSessionId) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(",")[1];

      const payload = {
        filename: file.name,
        content: base64,
        message: "Chunk this file please!",
      };

      try {
        const res = await fetch(`${API_BASE}/upload_base64`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        addMessage(
          `File uploaded. Preview:\n\n${data.preview} and chunks: ${data.chunks}`,
          "bot"
        );
      } catch (err) {
        console.error("Upload error:", err);
      }
    };

    reader.readAsDataURL(file);
  };

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      name: `Session ${sessions.length + 1}`,
      model: selectedModel,
      messages: [],
    };
    setSessions((prev) => [...prev, newSession]);
    setActiveSessionId(newId);
  };
  const modelEndpointMap = {
    qwen: `${API_BASE}/chat-qwen`,
    gemini: `${API_BASE}/chat-gemini`,
    gpt: `${API_BASE}/chat-gpt`,
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeSessionId) return;

    addMessage(message, "user");
    setMessage("");

    const endpoint = modelEndpointMap[selectedModel];

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      addMessage(data.response, "bot");
    } catch (err) {
      console.error(err);
      addMessage("Error contacting chat API.", "bot");
    }
  };

  return (
    <div className={styles.chatLayout}>
      <HistorySidebar
        title="History"
        items={sessions.map((s) => ({ id: s.id, name: s.name }))}
        activeId={activeSessionId}
        onSelect={(id) => setActiveSessionId(id)}
        onDelete={(id) => {
          setSessions((prev) => prev.filter((s) => s.id !== id));
          if (activeSessionId === id) setActiveSessionId(null);
        }}
        onAdd={createNewSession}
      />

      {/* Main Chat Area */}
      <div className={styles.chatArea}>
        <div className={styles.modelSelectorBox}>
          <select
            id="model-select"
            className={styles.modelSelect}
            value={selectedModel}
            onChange={(e) => {
              const model = e.target.value as "qwen" | "gemini" | "gpt";
              if (!activeSessionId) return;
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === activeSessionId ? { ...s, model } : s
                )
              );
            }}
          >
            <option value="qwen">Qwen2.5 14B</option>
            <option value="gemini">Gemini</option>
            <option value="gpt">GPT</option>
          </select>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className={styles.inputContainer}>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            📎
          </button>
          <textarea
            className={styles.textarea}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className={styles.sendButton}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
