import { useRef, useState, FormEvent, KeyboardEvent } from "react";
import { Message } from "../ChatBot";
import { SendIcon } from "./SendIcon";
import styles from "../Chatbot.module.css";

interface Props {
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  generateBotResponse: (history: Message[]) => Promise<void>;
}

const ChatForm = ({ setChatHistory, chatHistory, generateBotResponse }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (userMessage: string) => {
    const updatedHistory = [...chatHistory, { role: "user", text: userMessage }];
    setChatHistory(updatedHistory);
    setTimeout(() => generateBotResponse(updatedHistory), 100);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;
    handleSubmit(userMessage);
    if (inputRef.current) {
      inputRef.current.value = "";
      setInputValue("");
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const userMessage = inputRef.current?.value.trim();
      if (!userMessage) return;
      handleSubmit(userMessage);
      if (inputRef.current) {
        inputRef.current.value = "";
        setInputValue("");
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className={styles["chat-form"]}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className={styles["message-input"]}
        aria-label="Chat message input"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        className={styles["send-button"]}
        aria-label="Send message"
        disabled={!inputValue.trim()}
      >
        <SendIcon width={25} height={25} color="#fff" />
      </button>
    </form>
  );
};

export default ChatForm;