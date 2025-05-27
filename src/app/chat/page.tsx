'use client'
import { useState, useRef} from 'react'
import styles from './ChatPage.module.css'

type Message = {
  role: 'user' | 'bot'
  content: string
}
export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [messages,setMessages]=useState<Message[]>([])

 const addMessage = (text: string, role: 'user' | 'bot') => {
    setMessages((prev) => [...prev, { role, content: text }])
  }

  const handleSend =async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

  // Add user message
  addMessage(message, 'user')
  const userInput = message
  setMessage('')

  try {
    const res = await fetch('https://eaa6-34-125-226-17.ngrok-free.app/chat-gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    })

    const data = await res.json()
    addMessage(data.response, 'bot')
  } catch (err) {
    console.error(err)
    addMessage('Error contacting Qwen API.', 'bot')
  }}

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0])
  }

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
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            📎
          </button>
          <textarea
            className={styles.textarea}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className={styles.sendButton}>➤</button>
        </form>
      </div>
    </div>
  )
}
