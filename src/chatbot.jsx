import React, { useState, useRef, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./chatbot.css"; // Make sure to import FontAwesome styles and your custom chatbot.css
import { textQuery } from "./api";
const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmptyInputWarning, setShowEmptyInputWarning] = useState(false);
  const [productCardRendered, setProductCardRendered] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const chatMessagesRef = useRef(null);
  const [totalPrice, setTotalPrice] = useState(0);

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
      const products = [
        {
          name: "Mango Tree",
          price: 19.95,
          seller: "ah sour",
          url: "https://plantly.io/wp-content/uploads/2020/10/IMG_8406-300x300.jpg",
          rating: 4,
        },
        {
          name: "Mango",
          price: 20,
          seller: "ah chak",
          url: "https://plantly.io/wp-content/uploads/2020/10/Clivia-2022-2-300x300.webp",
          rating: 3,
        },
        {
          name: "Sun Flower",
          price: 30,
          seller: "ah poo",
          url: "https://plantly.io/wp-content/uploads/2023/04/earthstar-300x300.jpg",
          rating: 5,
        },
        {
          name: "Cacao Tree",
          price: 19.9945,
          seller: "ah jm tou",
          url: "https://plantly.io/wp-content/uploads/2023/03/IMG_7603-300x300.jpg",
          rating: 4,
        },
        {
          name: "Happy Leaf",
          price: 22,
          seller: "Leng",
          url: "https://plantly.io/wp-content/uploads/2023/09/Screenshot-2023-09-27-161836.jpg",
          rating: 3,
        },
      ];

      if (intentResponse === "show.product") {
        // Reset the productCardRendered state to false
        setProductCardRendered(false);

        const productElements = products.map((product, index) => (
          <div key={index} className="product-card">
            <div>
              <img src={product.url} alt={product.name} />
            </div>
            <div className="product-dis">
              <div className="product-name">Name: {product.name}</div>

              <div>Price: {product.price}$</div>
              <div className="star-row">
                {[...Array(product.rating)].map((_, starIndex) => (
                  <FontAwesomeIcon
                    key={starIndex}
                    icon={faStar}
                    size="sm"
                    className="star"
                  />
                ))}
              </div>
              <div>
                Sold by:
                <a href="{product.seller_link}">{product.seller}</a>
              </div>
            </div>
            <div className="button-card">
              <button onClick={() => addToCart(product)}>Add to cart</button>
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
      } else if (intentResponse === "recommend.product") {
        // Reset the productCardRendered state to false
        setProductCardRendered(false);

        const recommendedProducts = products.filter(
          (product) => product.rating >= 4
        );

        const productElements = recommendedProducts.map((product, index) => (
          <div key={index} className="product-card">
            <div>
              <img src={product.url} alt={product.name} />
            </div>
            <div className="product-dis">
              <div className="product-name">Name: {product.name}</div>

              <div>Price: {product.price}$</div>
              <div className="star-row">
                {[...Array(product.rating)].map((_, starIndex) => (
                  <FontAwesomeIcon
                    key={starIndex}
                    icon={faStar}
                    size="sm"
                    className="star"
                  />
                ))}
              </div>
              <div>
                Sold by:
                <a href="{product.seller_link}">{product.seller}</a>
              </div>
            </div>
            <div className="button-card">
              <button onClick={() => addToCart(product)}>Add to cart</button>
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

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.name === product.name
    );

    if (existingItemIndex !== -1) {
      setCartItems((prevItems) => {
        const newCartItems = [...prevItems];
        const existingItem = newCartItems[existingItemIndex];
        existingItem.quantity += 1;

        for (let i = 1; i < existingItem.quantity; i++) {
          newCartItems.push({ ...existingItem });
        }
        return newCartItems;
      });
    } else {
      setCartItems((prevItems) => [
        ...prevItems,
        { ...product, timeAdded: new Date(), quantity: 1 },
      ]);
    }
    calculateTotalPrice();
  };

  console.log(cartItems);
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

    const cartItemsWithCount = cartItems.reduce((acc, item) => {
      const existingItemIndex = acc.findIndex((i) => i.name === item.name);
      if (existingItemIndex !== -1) {
        acc[existingItemIndex].count += 1;
      } else {
        acc.push({ ...item, count: 1 });
      }
      return acc;
    }, []);

    const roundedTotalPrice = totalPrice.toFixed(2); // Round to 2 decimal places

    return (
      <div className="cart">
        <h3>Shopping Cart</h3>
        <ul>
          {cartItemsWithCount.map((item, index) => (
            <li key={index}>
              {item.name} - {item.price}$ x{item.count}
            </li>
          ))}
        </ul>
        <p>Total price: ${roundedTotalPrice}</p>
        <button> check out</button>
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
      {renderCart()}
    </div>
  );
};

export default Chatbot;
