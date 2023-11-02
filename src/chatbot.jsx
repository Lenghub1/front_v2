import React, { useState } from "react";
import Axios from "axios";
import "./chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

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
      console.log(response);
      setInput(""); // Clear the input field
    } catch (error) {
      const errorMessage = "Error, please check your request";

      // Add error message to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { who: "bot", text: errorMessage },
      ]);
    }
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      textQuery(input);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={message.who}>
            <div>
              {/* {message.who === 'user' ? '' : ''} */}
              {message.text}
            </div>
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
