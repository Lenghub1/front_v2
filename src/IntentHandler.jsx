import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const handleShowProduct = (
  response,
  setMessages,
  setProductCardRendered,
  products,
  scrollToBottom,
  addToCart
) => {
  const productElements = products.map((product, index) => (
    <div key={index} className="product-card">
      <div>
        <img src={product.url} alt={product.name} />
      </div>
      <div className="product-dis">
        <div className="product-name">Name: {product.name}</div>

        <div>Price: {product.price}$</div>
        <div className="star-row">
          {[...Array(product.rate)].map((_, starIndex) => (
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
          <a href={product.seller_link}>{product.seller}</a>
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
};

const handleRecommendProduct = (
  response,
  setMessages,
  setProductCardRendered,
  products,
  scrollToBottom,
  addToCart
) => {
  const recommendedProducts = products.filter((product) => product.rate >= 4);

  const productElements = recommendedProducts.map((product, index) => (
    <div key={index} className="product-card">
      <div>
        <img src={product.url} alt={product.name} />
      </div>
      <div className="product-dis">
        <div className="product-name">Name: {product.name}</div>

        <div>Price: {product.price}$</div>
        <div className="star-row">
          {[...Array(product.rate)].map((_, starIndex) => (
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
          <a href={product.seller_link}>{product.seller}</a>
        </div>
        <div className="button-card">
          <button onClick={() => addToCart(product)}>Add to cart</button>
        </div>
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
};

const handleFindProduct = (
  response,
  setMessages,
  setProductCardRendered,
  products,
  scrollToBottom,
  addToCart
) => {
  const searchTerm = response.data.parameters.fields.product.stringValue;
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productElements = filteredProducts.map((product, index) => (
    <div key={index} className="product-card">
      <div>
        <img src={product.url} alt={product.name} />
      </div>
      <div className="product-dis">
        <div className="product-name">Name: {product.name}</div>

        <div>Price: {product.price}$</div>
        <div className="star-row">
          {[...Array(product.rate)].map((_, starIndex) => (
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
          <a href={product.seller_link}>{product.seller}</a>
        </div>
        <div className="button-card">
          <button onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      </div>
    </div>
  ));

  if (filteredProducts.length > 0) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: <div className="product-container">{productElements}</div>,
      },
    ]);
  } else {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: "Sorry, no products found.",
      },
    ]);
  }

  setProductCardRendered(true);
  scrollToBottom();
};
const handleRecommendCategory = (
  response,
  setMessages,
  setProductCardRendered,
  products,
  scrollToBottom,
  addToCart
) => {
  const category =
    response.data.parameters.fields.category.listValue.values[0].stringValue;

  const recommendedCategoryProducts = products.filter(
    (product) =>
      product.category.toLowerCase() === category.toLowerCase() &&
      product.rate >= 4
  );

  const productElements = recommendedCategoryProducts.map((product, index) => (
    <div key={index} className="product-card">
      <div>
        <img src={product.url} alt={product.name} />
      </div>
      <div className="product-dis">
        <div className="product-name">Name: {product.name}</div>
        <div>Price: {product.price}$</div>
        <div className="star-row">
          {[...Array(product.rate)].map((_, starIndex) => (
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
          <a href={product.seller_link}>{product.seller}</a>
        </div>
        <div className="button-card">
          <button onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      </div>
    </div>
  ));

  if (recommendedCategoryProducts.length > 0) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: <div className="product-container">{productElements}</div>,
      },
    ]);
  } else {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: `Sorry, no products found in the ${category} category with a rating of 4 or higher.`,
      },
    ]);
  }

  setProductCardRendered(true);
  scrollToBottom();
};
const handleAddOrder = (
  text,
  setMessages,
  scrollToBottom,
  addToCart,
  products,
  response
) => {
  const productValues =
    response.data.parameters.fields.product.listValue.values;
  const numberValues = response.data.parameters.fields.number.listValue.values;

  if (productValues.length < numberValues.length) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        who: "bot",
        text: "Please provide a specific quantity for each product.",
      },
    ]);
    scrollToBottom();
    return;
  }

  if (productValues.length > numberValues.length) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        who: "bot",
        text: "Please provide the number of the product you want to order.",
      },
    ]);
    scrollToBottom();
    return;
  }

  for (let i = 0; i < productValues.length; i++) {
    const quantity = numberValues[i].numberValue;
    const productName = productValues[i].stringValue;

    const selectedProduct = products.find(
      (product) => product.name.toLowerCase() === productName.toLowerCase()
    );

    if (selectedProduct) {
      addToCart(selectedProduct, quantity);
    } else {
      console.error(`Product '${productName}' not found in the product list.`);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          who: "bot",
          text: `Product '${productName}' not found in the product list.`,
        },
      ]);
    }
  }

  setMessages((prevMessages) => [
    ...prevMessages,
    { who: "bot", text: response.data.fulfillmentText },
  ]);

  scrollToBottom();
};

const handleRemoveOrder = (
  setMessages,
  response,
  text,
  removeFromCart,
  products
) => {
  const productValues =
    response.data.parameters.fields.product.listValue.values;
  const numberValues = response.data.parameters.fields.number.listValue.values;
  if (numberValues.length === 0) {
    for (let i = 0; i < productValues.length; i++) {
      const productName = productValues[i].stringValue;

      const selectedProduct = products.find(
        (product) => product.name.toLowerCase() === productName.toLowerCase()
      );
      if (selectedProduct) {
        removeFromCart(selectedProduct);
        setMessages((prevMessages) => [
          ...prevMessages,
          { who: "bot", text: response.data.fulfillmentText },
        ]);
        scrollToBottom();
      } else {
        console.error(
          `Product '${productName}' not found in the product list.`
        );
      }
    }
  } else {
    for (let i = 0; i < productValues.length; i++) {
      const quantity = numberValues[i].numberValue;
      const productName = productValues[i].stringValue;

      const selectedProduct = products.find(
        (product) => product.name.toLowerCase() === productName.toLowerCase()
      );

      if (selectedProduct) {
        removeFromCart(selectedProduct, quantity);
      } else {
        console.error(
          `Product '${productName}' not found in the product list.`
        );
      }
    }
  }
};
export {
  handleShowProduct,
  handleRecommendProduct,
  handleFindProduct,
  handleRecommendCategory,
  handleAddOrder,
  handleRemoveOrder,
};
