import React, { useState, useRef, useEffect } from "react";
import Axios from "axios";
import "./chatbot.css";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmptyInputWarning, setShowEmptyInputWarning] = useState(false);
  const [productCardRendered, setProductCardRendered] = useState(false);
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

      const intentResponse = response.data.intent.displayName;
      const botResponse = response.data.fulfillmentText;

      setMessages((prevMessages) => [
        ...prevMessages,
        { who: "bot", text: botResponse },
      ]);

      if (intentResponse === "show.product") {
        // Reset the productCardRendered state to false
        setProductCardRendered(false);

        const products = [
          {
            name: "Mango Tree",
            price: `$${(Math.random() * 50).toFixed(2)}`,
            seller: "ah sour",
          },
          {
            name: "Mango",
            price: `$${(Math.random() * 20).toFixed(2)}`,
            seller: "ah chak",
          },
          {
            name: "Sun Flower",
            price: `$${(Math.random() * 30).toFixed(2)}`,
            seller: "ah poo",
          },
          {
            name: "Cacao Tree",
            price: `$${(Math.random() * 40).toFixed(2)}`,
            seller: "ah jm tou",
          },
          {
            name: "Happy Leaf",
            price: `$${(Math.random() * 10).toFixed(2)}`,
            seller: "Leng",
          },
        ];

        const productElements = products.map((product, index) => (
          <div key={index} className="product-card">
            <div className="product-name">Name: {product.name}</div>
            <div>
              <img
                src="https://tse4.mm.bing.net/th?id=OIP.0rdnycv60_W_KXagEX5tHwHaHa&pid=Api&P=0&h=220"
                alt={product.name}
              />
            </div>
            <p>owner: {product.seller}</p>
            <div>Price: {product.price}</div>
            <div className="button-card">
              <button>Buy</button>
              <button>view</button>
            </div>
          </div>
        ));

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: <div className="product-container">{productElements}</div>,
          },
        ]);

        setProductCardRendered(true);
        scrollToBottom();
      }

     
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

  const handleButtonClick = (buttonText) => {
    textQuery(buttonText);
    setInput("");
  };

  const renderNewOrderButton = () => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].text === "Please make a new order. 🤓"
    ) {
      return (
        <div className="new-order-btn">
          <button onClick={() => handleButtonClick("i want to make new order")}>
            Make a New Order
          </button>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, productCardRendered]);

  useEffect(() => {
    const welcomeMessage = "Welcome! How can I assist you today?";
    setMessages([{ who: "bot", text: welcomeMessage, special: true }]);
  }, []);

  return (
    <div className="chatbot">
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((message, index) => (
          <div key={index} className={message.who}>
            <div>{message.text}</div>
          </div>
        ))}
        {renderNewOrderButton()}
      </div>
      {showEmptyInputWarning && (
        <div className="empty-input-warning">Please enter a message.</div>
      )}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onKeyPress={keyPressHandler}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />

        {messages.length > 0 && messages[messages.length - 1].special && (
          <div className="btn">
            <button
              onClick={() => handleButtonClick("i want to make new order ")}
            >
              Would you like to make an order?
            </button>
            <button
              onClick={() =>
                handleButtonClick(
                  "I would like to get a recommendation for a product"
                )
              }
            >
              Do you want me to recommend you a product?
            </button>
            <button
              onClick={() => handleButtonClick("i want to see your product")}
            >
              Do you want to see our products?
            </button>
            <button
              onClick={() =>
                handleButtonClick("i would like to know your refund policy")
              }
            >
              Do you want to know about our refund policy?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
