import React, { useState, useEffect } from 'react'; // Import useEffect for making API calls
import Axios from 'axios'; // Correct import statement

const Chatbot = () => {
  const [input, setInput] = useState(''); // Declare input state variable
  const [messages, setMessages] = useState([]); // State to store chat messages

  // Define a function to send a text query to your API
  const textQuery = async (text) => {
    try {
      const response = await Axios.post('http://localhost:4000/api/dialogflow/textQuery', {
        text: text,
      });
      const content = response.data.fulfillmentMessages[0];
      const newMessage = {
        who: 'bot',
        content: content,
      };
      // Update the messages state with the new message
      setMessages([...messages, newMessage]);
    } catch (error) {
      const newMessage = {
        who: 'bot',
        content: {
          text: {
            text: 'Error, please check your request',
          },
        },
      };
      // Update the messages state with the error message
      setMessages([...messages, newMessage]);
    }
  };

  // Define a function to handle user input
  const keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      // Call the textQuery function with the user's input
      textQuery(input);
      setInput(''); // Clear the input field
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-messages">
        {/* Render chat messages */}
        {messages.map((message, index) => (
          <div key={index} className={message.who}>
            {message.content.text.text}
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
