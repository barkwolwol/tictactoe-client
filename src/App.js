import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";

function App() {
  return (
    <Router basename="/tictactoe-client/">
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:roomName" element={<GameRoom />} />
      </Routes>
    </Router>
  );
}

export default App;