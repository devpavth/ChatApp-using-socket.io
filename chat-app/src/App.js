import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'; 
import Chat from './pages/Chat/Chat';
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import SetAvatar from "./pages/SetAvatar/SetAvatar";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/setAvatar" element={<SetAvatar/>} />
        <Route path="/" element={<Chat/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;