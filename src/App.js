import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://tictactoe-server-htl6.onrender.com");

const App = () => {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);

  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState("");
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    socket.on("playerSymbol", setPlayerSymbol);

    socket.on("boardUpdate", ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
    });

    socket.on("gameOver", setWinner);

    socket.on("chatMessage", ({ player, message }) => {
      setChatLog((prev) => [...prev, { player, message }]);
    });

    return () => {
      socket.off("playerSymbol");
      socket.off("boardUpdate");
      socket.off("gameOver");
      socket.off("chatMessage");
    };
  }, []);

  const joinRoom = () => {
    if (roomId.trim() !== "") {
      socket.emit("joinRoom", roomId);
      setJoined(true);
    }
  };

  const handleClick = (index) => {
    if (!winner && board[index] === null && playerSymbol === currentTurn) {
      socket.emit("makeMove", { roomId, index });
    }
  };

  const handleRestart = () => {
    socket.emit("restartGame", roomId);
    setChatLog([]);
  };

  const handleSendMessage = () => {
    if (chatInput.trim() !== "") {
      socket.emit("chatMessage", { roomId, message: chatInput });
      setChatInput("");
    }
  };

  const renderCell = (index) => (
    <button
      key={index}
      onClick={() => handleClick(index)}
      style={{ width: 60, height: 60, fontSize: 24 }}
    >
      {board[index]}
    </button>
  );

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter Room ID</h2>
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
        />
        <button onClick={joinRoom}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Room: {roomId}</h2>
      <h3>You are: {playerSymbol}</h3>
      {winner ? (
        <h3>{winner === "draw" ? "It's a draw!" : `${winner} wins!`}</h3>
      ) : (
        <h3>Turn: {currentTurn}</h3>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 60px)",
          gap: 5,
          marginBottom: 20,
        }}
      >
        {board.map((_, i) => renderCell(i))}
      </div>

      {winner && (
        <button onClick={handleRestart} style={{ marginBottom: 20 }}>
          Restart Game
        </button>
      )}

      <div style={{ maxHeight: 150, overflowY: "auto", marginBottom: 10 }}>
        {chatLog.map((chat, i) => (
          <div key={i}>
            <strong>{chat.player}:</strong> {chat.message}
          </div>
        ))}
      </div>

      <div>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
