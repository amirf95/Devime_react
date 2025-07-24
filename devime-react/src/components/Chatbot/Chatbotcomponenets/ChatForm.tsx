import { useRef, useState, FormEvent, KeyboardEvent } from "react";
import { Message } from "../ChatBot";
import  "../Chatbot.css";
import { Send } from "lucide-react";

interface Props {
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  generateBotResponse: (history: Message[]) => Promise<void>;
}

const ChatForm = ({ setChatHistory, chatHistory, generateBotResponse }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (userMessage: string) => {
    // Corrected message structure - using 'response' instead of 'text'
    const newMessage: Message = {
      role: "user",
      response: userMessage // or { text: userMessage } if you prefer the object format
    };
    
    const updatedHistory = [...chatHistory, newMessage];
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
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        aria-label="Chat message input"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        className="send-button"
        aria-label="Send message"
        disabled={!inputValue.trim()}
      >
        <div className="SEND" style={{ background: "#e6b800", borderRadius: "50%", padding: 10 }}>
          <Send />
        </div>
      </button>
    </form>
  );
};

export default ChatForm;