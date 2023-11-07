import React, { useEffect, useState } from "react";
import io from "socket.io-client";


const SocketTest = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:4000"); // Replace with your server URL

    socket.on("connect", () => {
      console.log("Connected to the server via WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server via WebSocket");
    });

    socket.on("orderStored", (data) => {
        console.log("Product stored:", data.message);
        setNotifications((prevNotifications) => [...prevNotifications, data.message]);
        console.log("Notifications:", notifications);
      });
      

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div>
      <h2>Socket.IO Notifications</h2>
      <div className={`noti ${showNotifications ? 'show-notifications' : ''}`} onClick={toggleNotifications}>
        <i className="fa-regular fa-bell"></i>
        <ul className="notification-list">
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default SocketTest;
