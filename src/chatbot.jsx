import React, { useState, useRef, useEffect } from "react";
import Axios from "axios";
import "./chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatMessagesRef = useRef(null); // Add this ref

  // Function to scroll to the bottom of the chat messages
  const scrollToBottom = () => {
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  };

  const textQuery = async (text) => {
    // Add user's input to the chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { who: "user", text: text },
    ]);

    try {
      // Bot response
      const response = await Axios.post(
        "http://localhost:4000/api/dialogflow/textQuery",
        {
          text: text,
        }
      );

      const botResponse = response.data.fulfillmentText;
      // Add bot's response to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { who: "bot", text: botResponse },
      ]);
      scrollToBottom(); // Scroll to the bottom after adding the bot's response
      setInput(""); // Clear the input field
    } catch (error) {
      const errorMessage = "Error, please check your request";

      // Add error message to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { who: "bot", text: errorMessage },
      ]);
      scrollToBottom(); // Scroll to the bottom after adding the error message
    }
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      textQuery(input);
    }
  };

  // Use useEffect to scroll to the bottom when the component is initially rendered or when messages change
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
