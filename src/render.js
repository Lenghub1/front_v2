// RenderCart.js
import React from "react";

const RenderCart = ({ cartItems }) => {
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="cart">
      <h3>Shopping Cart</h3>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RenderCart;
