"use client";
import { useState, useRef } from "react";
import styles from "./ChatPage.module.css";

type Message = {
  role: "user" | "bot";
  content: string;
};
export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (text: string, role: "user" | "bot") => {
    setMessages((prev) => [...prev, { role, content: text }]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addMessage(message, "user");
    setMessage("");

    try {
      const res = await fetch("API", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }), // just send text
      });

      const data = await res.json();
      addMessage(data.response, "bot");
    } catch (err) {
      console.error(err);
      addMessage("Error contacting chat API.", "bot");
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(",")[1]; // Remove metadata

      const payload = {
        filename: file.name,
        content: base64,
        message: "Chunk this file please!",
      };

      try {
        const res = await fetch("API", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        addMessage(
          ` File uploaded. Preview:\n\n${data.preview} and chuncks: ${data.chunks}`,
          "bot"
        );
      } catch (err) {
        console.error("Upload error:", err);
      }
    };

    reader.readAsDataURL(file); // This triggers `onloadend`
  };

  return (
    <div className={styles.chatLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h3>History</h3>
        <ul>
          <li>Session A</li>
          <li>Session B</li>
        </ul>
      </aside>

      {/* Main Chat Area */}
      <div className={styles.chatArea}>
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
