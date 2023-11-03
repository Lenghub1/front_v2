import React, { useState, useRef, useEffect } from "react";
import Axios from "axios";
import "./chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmptyInputWarning, setShowEmptyInputWarning] = useState(false);
  const chatMessagesRef = useRef(null);

  const scrollToBottom = () => {
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  };

  const textQuery = async (text) => {
    if (text.trim() === "") {
      setShowEmptyInputWarning(true);
      setTimeout(() => {
        setShowEmptyInputWarning(false);
      }, 1000);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { who: "user", text: text },
    ]);

    try {
      const response = await Axios.post(
        "http://localhost:4000/api/dialogflow/textQuery",
        {
          text: text,
        }
      );

      const botResponse = response.data.fulfillmentText;
      setMessages((prevMessages) => [
        ...prevMessages,
        { who: "bot", text: botResponse },
      ]);
      scrollToBottom();
      setInput("");
    } catch (error) {
      const errorMessage = "Error, please check your request";

      setMessages((prevMessages) => [
        ...prevMessages,
        { who: "bot", text: errorMessage },
      ]);
      scrollToBottom();
    }
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      textQuery(input);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatbot">
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((message, index) => (
          <div key={index} className={message.who}>
            <div>{message.text}</div>
          </div>
        ))}
      </div>
      {showEmptyInputWarning && (
        <div className="empty-input-warning">
          Please enter a message.
        </div>
      )}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onKeyPress={keyPressHandler}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default Chatbot;
