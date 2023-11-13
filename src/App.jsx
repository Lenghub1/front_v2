import React from 'react';
import Chatbot from './chatbot';
import './App.css'
import SocketTest from './notif';
function App() {
  return (
    <div className='screen'>
      <h1> Rukhak bot</h1>
      <Chatbot />
      <SocketTest />
    </div>
  );
}

export default App;
