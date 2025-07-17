import { useEffect, useRef, useState } from "react";
import styles from "./ChatBot.module.css";
import ChatForm from "./Chatbotcomponenets/ChatForm";
import ChatMessage from "./Chatbotcomponenets/ChatMessage";
import { CloseIcon } from "./Chatbotcomponenets/CloseIcon";
import { ChatbotIcon } from "./Chatbotcomponenets/ChatbotIcon";

export interface Message {
  role: string;
  text: string;
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
      setChatHistory((prev) => [...prev, { role: "model", text: "Thinking..." }]);
      // Simulate API call (replace with your actual API)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const botMessage = "This is a sample bot response!";
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text: botMessage },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text: "Error: Something went wrong!", isError: true },
      ]);
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className={`${styles.container} ${showChatbot ? styles["show-chatbot"] : ""}`}>
      <button className={styles.toggler} onClick={toggleChatbot}>
        <span className={`${styles.icon} ${styles["chat-icon"]}`}>💬</span>
        <span className={`${styles.icon} ${styles["close-icon"]}`}>✕</span>
      </button>
      <div className={styles.popup}>
        <div className={styles.header}>
          <div className={styles["header-info"]}>
            <ChatbotIcon size={35} color="#fff" />
            <span className={styles["logo-text"]}>Chatbot</span>
          </div>
          <button onClick={toggleChatbot} className={styles["close-button"]}>
            <CloseIcon size={24} color="#fff" />
          </button>
        </div>
        <div className={styles["chat-body"]} ref={chatBodyRef}>
          {chatHistory.map((msg, idx) => (
            <ChatMessage key={idx} chat={msg} />
          ))}
        </div>
        <div className={styles.footer}>
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