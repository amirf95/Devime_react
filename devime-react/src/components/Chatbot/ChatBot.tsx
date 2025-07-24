import { useEffect, useRef, useState } from "react";
import "./ChatBot.css";
import ChatForm from "./Chatbotcomponenets/ChatForm";
import ChatMessage from "./Chatbotcomponenets/ChatMessage";
import { CloseIcon } from "./Chatbotcomponenets/CloseIcon";
import { ChatbotIcon } from "./Chatbotcomponenets/ChatbotIcon";
import ErrorBoundary from "./Chatbotcomponenets/ErrorBoundary";
import { Send } from "lucide-react";


export interface textResponse     {
  text:string;
}
export type MessaageResponse = string | textResponse;
export interface Message {
  role: "user" | "model";
  response:MessaageResponse;
  isError?: boolean;
}

export default function Chatbot() {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

const generateBotResponse = async (history: Message[]) => {
  try {
    // Add thinking indicator
    setChatHistory((prev) => [
      ...prev,
      { role: "model", response: "Thinking..." },
    ]);

    // Validate chat history exists
    if (!history.length) {
      throw new Error("Chat history is empty");
    }

    // Validate all messages before processing
    const validateMessage = (msg: Message): string => {
      if (!msg) throw new Error("Null message encountered");
      
      if (typeof msg.response === "string") {
        return msg.response.trim();
      }
      
      if (typeof msg.response === "object" && msg.response !== null && "text" in msg.response) {
        if (typeof msg.response.text === "string") {
          return msg.response.text.trim();
        }
        throw new Error("Message text must be a string");
      }
      
      throw new Error(`Invalid message format: ${JSON.stringify(msg)}`);
    };

    // Process last message
    const lastMessage = history[history.length - 1];
    const lastMessageText = validateMessage(lastMessage);
    
    if (!lastMessageText) {
      throw new Error("Message text cannot be empty");
    }

    // Process full history
    const formattedChatHistory = history.map(msg => ({
      role: msg.role,
      response: validateMessage(msg)
    }));

    const payload = {
      message: lastMessageText,
      chatHistory: formattedChatHistory,
    };

    console.log("Payload to backend:", payload);

    const response = await fetch("http://localhost:8000/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Received from backend:", data);

    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.response !== "Thinking..."),
      data,
    ]);

  } catch (error) {
    console.error("Chat error:", error);
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.response !== "Thinking..."),
      {
        role: "model",
        response: error instanceof Error ? error.message : "Error processing message",
        isError: true,
      },
    ]);
  }
};

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button className="toggler" onClick={toggleChatbot}>
        <span className={`icon chat-icon`}>💬</span>
        <span className={`icon close-icon`}>✕</span>
      </button>
      <div className="popup">
        <div className="header">
          <div className="header-info">
            <ChatbotIcon size={35} color="#fff" />
            <span className="logo-text">Chatbot</span>
          </div>
          <button onClick={toggleChatbot} className="close-button">
            <CloseIcon size={24} color="#fff" />
          </button>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
        <ErrorBoundary>
          {chatHistory.map((msg, idx) => (
            <ChatMessage key={idx} chat={msg} />
          ))}
        </ErrorBoundary>
        </div>
        <div className="footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
}