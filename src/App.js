import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./Lobby";
import GameRoom from "./GameRoom";

function App() {
  return (
    <Router basename="/barkwolwol/tictactoe-client">
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:roomName" element={<GameRoom />} />
      </Routes>
    </Router>
  );
}

export default App;