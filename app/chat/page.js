"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./chat.css";

const QUICK_PROMPTS = [
  "Why am I breaking out so much? 😟",
  "Is it normal if my growth feels uneven?",
  "Why am I feeling angry for no reason today?",
  "How much sleep do I actually need?",
  "What are normal mood swings like?",
  "How to handle stress at school?",
];

const TOPIC_QUESTIONS = {
  body: "Hi Navi! Can you help me understand the different stages of puberty and what body changes are completely normal?",
  skin: "Hi Navi! I'm struggling with acne and oily skin. What's a good gentle skincare routine for teenagers?",
  moods: "Hi Navi! Why do I feel so emotional sometimes? Are intense mood swings during puberty normal?",
  sleep: "Hi Navi! I'm always so tired. How much sleep do I actually need as a teenager and how can I sleep better?",
};

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [topicHandled, setTopicHandled] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Ghost Mode - Escape key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        activateGhostMode();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Auto-send topic question when coming from a topic card
  useEffect(() => {
    if (topicHandled) return;
    const topic = searchParams.get("topic");
    if (topic && TOPIC_QUESTIONS[topic]) {
      setTopicHandled(true);
      sendMessage(TOPIC_QUESTIONS[topic]);
    }
  }, [searchParams, topicHandled]);

  const activateGhostMode = () => {
    setMessages([]);
    setInput("");
    setGhostMode(true);
  };

  const exitGhostMode = () => {
    setGhostMode(false);
  };

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble right now. Please try again in a moment. 💗",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please check your connection and try again. 💗",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (ghostMode) {
    return (
      <div className="ghost-overlay">
        <div style={{ fontSize: "4rem" }}>🔒</div>
        <h2>Session Cleared</h2>
        <p>All conversations have been erased. Your privacy is safe.</p>
        <button className="btn-primary" onClick={exitGhostMode}>
          Start Fresh →
        </button>
        <Link href="/" className="btn-secondary" style={{ marginTop: "0.5rem" }}>
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Chat Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <Link href="/" className="chat-header-back">
            ← 
          </Link>
          <div className="chat-header-avatar">🌙</div>
          <div className="chat-header-info">
            <h2>Navi</h2>
            <span className="chat-header-status">Online &amp; listening safely</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="ghost-btn" onClick={activateGhostMode} title="Clear all data and exit">
            👻 <span>Ghost Mode</span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <>
            <div className="chat-welcome">
              <div className="chat-welcome-avatar">🌙</div>
              <h2>Hi there! I&apos;m Navi 💗</h2>
              <p>
                I&apos;m your private health companion. Ask me anything about growing up — puberty,
                feelings, skin, sleep, or anything else. It&apos;s completely safe and anonymous.
              </p>
            </div>
            <div className="quick-prompts">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  className="quick-prompt-btn"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === "user" ? "user" : "ai"}`}>
            <div className="message-avatar">
              {msg.role === "user" ? "👤" : "🌙"}
            </div>
            <div className="message-bubble">
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message ai">
            <div className="message-avatar">🌙</div>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything... it's completely private 🔒"
            rows={1}
            disabled={isLoading}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
          >
            ↑
          </button>
        </div>
        <p className="chat-disclaimer">
          Navi is an AI assistant, not a medical professional. For emergencies, please contact a trusted
          adult or call your local emergency services.
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="chat-page" />}>
      <ChatContent />
    </Suspense>
  );
}
