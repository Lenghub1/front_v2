import Axios from "axios";



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

  export { textQuery };