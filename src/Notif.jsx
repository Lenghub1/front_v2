// import React, { useEffect, useState } from "react";
// // import io from "socket.io-client";

// const SocketTest = () => {
//   const [buyerNotifications, setBuyerNotifications] = useState([]);
//   const [sellerNotifications, setSellerNotifications] = useState([]);
//   const [showBuyerNotifications, setShowBuyerNotifications] = useState(false);
//   const [showSellerNotifications, setShowSellerNotifications] = useState(false);

//   // useEffect(() => {
//   //   const socket = io("http://localhost:4000"); // Replace with your server URL

//   //   socket.on("connect", () => {
//   //     console.log("Connected to the server via WebSocket");
//   //   });

//   //   socket.on("disconnect", () => {
//   //     console.log("Disconnected from the server via WebSocket");
//   //   });

//   //   socket.on("buyerNotification", (data) => {
//   //     console.log("Product stored:", data.message);
//   //     setBuyerNotifications((prevNotifications) => [...prevNotifications, data.message]);
//   //   });

//   //   socket.on("sellerNotification", (data) => {
//   //     console.log("Seller notification:", data.message);
//   //     setSellerNotifications((prevNotifications) => [...prevNotifications, data.message]);
//   //   });

//   //   return () => {
//   //     socket.disconnect();
//   //   };
//   // }, []);

//   const toggleBuyerNotifications = () => {
//     setShowBuyerNotifications(!showBuyerNotifications);
//   };

//   const toggleSellerNotifications = () => {
//     setShowSellerNotifications(!showSellerNotifications);
//   };

//   return (
//     <div>
//       <h2>Socket.IO Notifications</h2>
//       <div className={`noti ${showBuyerNotifications ? 'show-notifications' : ''}`} onClick={toggleBuyerNotifications}>
//         {showBuyerNotifications ? (
//           <i className="fa-solid fa-bell"></i>
//         ) : (
//           <div style={{ position: "relative" }}>
//             <i className="fa-regular fa-bell"></i>
//             {buyerNotifications.length > 0 && (
//               <div className="notification-dot"></div>
//             )}
//           </div>
//         )}
//         <ul className="notification-list">
//           {buyerNotifications.map((notification, index) => (
//             <li key={index}>{notification}</li>
//           ))}
//         </ul>
//       </div>
//       <div className="sellernoti">
//         <div className={`noti ${showSellerNotifications ? 'show-notifications' : ''}`} onClick={toggleSellerNotifications}>
//           {showSellerNotifications ? (
//             <i className="fa-solid fa-bell"></i>
//           ) : (
//             <div style={{ position: "relative" }}>
//               <i className="fa-regular fa-bell"></i>
//               {sellerNotifications.length > 0 && (
//                 <div className="notification-dot"></div>
//               )}
//             </div>
//           )}
//           <ul className="notification-list">
//             {sellerNotifications.map((notification, index) => (
//               <li key={index}>{notification}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SocketTest;
