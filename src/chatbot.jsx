import React, { useState, useRef, useEffect } from "react";
import Axios from "axios";
import "./chatbot.css";
import {
  handleShowProduct,
  handleRecommendProduct,
  handleFindProduct,
  handleRecommendCategory,
  handleAddOrder,
} from "./IntentHandler";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmptyInputWarning, setShowEmptyInputWarning] = useState(false);
  const [productCardRendered, setProductCardRendered] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const chatMessagesRef = useRef(null);
  
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.name === product.name
      );

      if (existingItemIndex !== -1) {
        const newCartItems = [...prevItems];
        const existingItem = newCartItems[existingItemIndex];
        existingItem.quantity += quantity / 2;
        return newCartItems;
      } else {
        return [...prevItems, { ...product, quantity: quantity }];
      }
    });

    calculateTotalPrice();
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    setTotalPrice(totalPrice);
  };

  const scrollToBottom = () => {
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get(
          "http://localhost:4000/api/getproducts"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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
    setInput("");
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
        handleShowProduct(
          response,
          setMessages,
          setProductCardRendered,
          products,
          scrollToBottom,
          addToCart
        );
        setInput("");

      } else if (intentResponse === "recommend.product") {
        handleRecommendProduct(
          response,
          setMessages,
          setProductCardRendered,
          products,
          scrollToBottom,
          addToCart
        );
        setInput("");

      } else if (intentResponse === "find.product") {
        handleFindProduct(
          response,
          setMessages,
          setInput,
          products,
          scrollToBottom,
          addToCart
        );
        setInput("");

      } else if (intentResponse === "recommend.product.by.catagory") {
        handleRecommendCategory(
          response,
          setMessages,
          setInput,
          products,
          scrollToBottom,
          addToCart
        );
        setInput("");

      } else if (intentResponse === "add_order") {
        handleAddOrder(
          text,
          setMessages,
          scrollToBottom,
          addToCart,
          products,
          response
        );
        setInput("");

      } else if (intentResponse === "remove.product") {
        handleRemoveProduct(
          text,
          setMessages,
          scrollToBottom,
          removeFromCart,
          products
        );
        setInput("");
      }
    } catch (error) {}
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

  const renderCart = () => {
    if (cartItems.length === 0) {
      return null;
    }
    const roundedTotalPrice = totalPrice.toFixed(2);
    const mergeData = (cartItems) => {
      const mergedData = {};
      cartItems.forEach((item) => {
        const itemName = item.name;

        if (mergedData[itemName]) {
          mergedData[itemName].quantity += item.quantity;
        } else {
          mergedData[itemName] = { ...item };
        }
      });

      const mergedArray = Object.values(mergedData);

      return mergedArray;
    };
    const mergedCartItems = mergeData(cartItems);
    console.log(mergedCartItems);
    const handleCheckout = async () => {
      try {
        const checkoutData = {
          products: mergedCartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
          })),
        };

        const response = await Axios.post(
          "http://localhost:4000/api/checkout",
          checkoutData
        );

        console.log(response.data);
        setCartItems([]);
        setTotalPrice(0);
      } catch (error) {
        console.error("Error during checkout:", error);
      }
    };

    return (
      <div className="cart">
        <h3>Shopping Cart</h3>
        <ul>
          {mergedCartItems.map((item, index) => (
            <li key={index}>
              {item.name} - {item.price}$ x{item.quantity}
            </li>
          ))}
        </ul>
        <p>Total price: ${roundedTotalPrice}</p>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    );
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
    <div>
      <div className="chatbot">
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((message, index) => (
            <div key={index} className={message.who}>
              <div>{message.text}</div>
            </div>
          ))}
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
        </div>
      </div>
      {renderCart()}
    </div>
  );
};

export default Chatbot;
