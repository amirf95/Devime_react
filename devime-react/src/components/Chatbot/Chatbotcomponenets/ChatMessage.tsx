import { Message } from "../ChatBot";
import { ChatbotIcon } from "./ChatbotIcon";
import  "../Chatbot.css";

interface ChatMessageProps {
  chat: Message;
}

const ChatMessage = ({ chat }: ChatMessageProps) => {
  return (
    <div
      className={`message ${
        chat.role === "model" ? "bot-message" : "user-message"
      } ${chat.isError ? "error" : ""}`}
    >
      {chat.role === "model" && <ChatbotIcon size={35} color="#fff" />}
      <p className="message-text">
        {typeof chat.response === "string" ? chat.response : chat.response?.text || "No response available"}
      </p>
    </div>
  );
};

export default ChatMessage;