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
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // --- Speech Features ---
  // Voice Input (Speech-to-Text like Google Search)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      alert("Search by voice is supported in Google Chrome, Microsoft Edge, and Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Microphone access was denied. Please allow microphone access in your browser settings to use voice search.");
        } else if (event.error === 'no-speech') {
          // Ignore no-speech silently, just stops listening
        } else if (event.error === 'network') {
          alert("A network error occurred. Speech recognition requires an internet connection.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };

  // Text-to-Speech (Read assistant response aloud)
  const speakText = (text, index) => {
    if (!("speechSynthesis" in window)) return;
    
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Make it sound slightly friendlier/higher
    
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };
  // -----------------------

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

  // Cleanup speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const activateGhostMode = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }
    setIsListening(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
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
            <div className="message-bubble-wrapper">
              <div className="message-bubble">
                {msg.content}
              </div>
              {msg.role === "assistant" && (
                <button 
                  className={`speak-btn ${speakingIndex === i ? 'speaking' : ''}`}
                  onClick={() => speakText(msg.content, i)}
                  title="Read aloud"
                >
                  {speakingIndex === i ? "⏹️" : "🔊"}
                </button>
              )}
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
            placeholder={isListening ? "Listening... speak now 🎙️" : "Ask me anything... it's completely private 🔒"}
            rows={1}
            disabled={isLoading}
          />
          <button
            type="button"
            className={`chat-mic-btn ${isListening ? "listening" : ""}`}
            onClick={toggleListening}
            title={isListening ? "Listening... click to stop" : "Search by voice"}
            aria-label="Search by voice"
          >
            <svg className="google-mic-svg" viewBox="0 0 24 24" width="22" height="22">
              <path fill="#4285F4" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path fill="#34A853" d="M11 18.92h2V22h-2z"/>
              <path fill="#FBBC05" d="M7 11H5c0 3.53 2.61 6.43 6 6.92v-2.04c-2.39-.46-4-2.53-4-4.88z"/>
              <path fill="#EA4335" d="M19 11c0 2.35-1.61 4.42-4 4.88v2.04c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            title="Send message"
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
