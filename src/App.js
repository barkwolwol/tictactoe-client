import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3002");

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState("");
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on("playerSymbol", setPlayerSymbol);
    socket.on("boardUpdate", ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
    });
    socket.on("gameOver", (winner) => setWinner(winner));
  }, []);

  const handleClick = (index) => {
    if (!winner && board[index] === null && playerSymbol === currentTurn) {
      socket.emit("makeMove", index);
    }
  };

  const handleRestart = () => {
    socket.emit("restartGame");
  };

  const renderCell = (index) => (
    <button
      onClick={() => handleClick(index)}
      style={{ width: 60, height: 60, fontSize: 24 }}
    >
      {board[index]}
    </button>
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>You are: {playerSymbol}</h2>
      {winner ? (
        <h3>
          {winner === "draw" ? "It's a draw!" : `${winner} wins!`}
        </h3>
      ) : (
        <h3>Turn: {currentTurn}</h3>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 60px)", gap: 5 }}>
        {board.map((_, i) => renderCell(i))}
      </div>
      {winner && (
        <button onClick={handleRestart} style={{ marginTop: 20 }}>
          Restart Game
        </button>
      )}
    </div>
  );
};

export default App;