import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketTest = () => {
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const socket = io("http://localhost:4000/"); // Replace with your server URL

    socket.on('connect', () => {
      console.log('Connected to the server via WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server via WebSocket');
    });

    socket.on('newOrder', (data) => {
      // When a new notification is received, update the notification state
      setNotification(data.message);
      console.log("new order", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Socket.IO Notifications</h2>
      {notification ? (
        <div>
          <p>Notification:</p>
          <p>{notification}</p>
        </div>
      ) : (
        <p>No notifications yet.</p>
      )}
    </div>
  );
};

export default SocketTest;
