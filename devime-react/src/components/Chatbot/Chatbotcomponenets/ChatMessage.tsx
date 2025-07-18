import { Message } from "../ChatBot";
import { ChatbotIcon } from "./ChatbotIcon";
import styles from "../Chatbot.module.css";

interface ChatMessageProps {
  chat: Message;
}

const ChatMessage = ({ chat }: ChatMessageProps) => {
  return (
    <div
      className={`${styles.message} ${
        chat.role === "model" ? styles["bot-message"] : styles["user-message"]
      } ${chat.isError ? styles.error : ""}`}
    >
      {chat.role === "model" && <ChatbotIcon size={35} color="#fff" />}
      <p className={styles["message-text"]}>
        {typeof chat.response === "string" ? chat.response : chat.response?.text || "No response available"}
      </p>
    </div>
  );
};

export default ChatMessage;