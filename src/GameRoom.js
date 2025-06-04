import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "./socket";

function GameRoom() {
  const { roomName } = useParams();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.on("boardUpdate", ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
    });
    socket.on("gameOver", setWinner);
    socket.on("gameMessage", (msg) => setChatMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("boardUpdate");
      socket.off("gameOver");
      socket.off("gameMessage");
    };
  }, []);

  const handleClick = (index) => {
    if (!winner && board[index] === null) {
      socket.emit("makeMove", { roomName, index });
    }
  };

  const handleSendChat = (e) => {
    if (e.key === "Enter" && chatInput.trim()) {
      socket.emit("gameMessage", { roomName, msg: chatInput });
      setChatInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>게임방: {roomName}</h2>
      {winner ? (
        <h3>{winner === "draw" ? "무승부!" : `${winner} 승리!`}</h3>
      ) : (
        <h3>턴: {currentTurn}</h3>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 60px)", gap: 5 }}>
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{ width: 60, height: 60, fontSize: 24 }}
          >
            {cell}
          </button>
        ))}
      </div>

      <h3>채팅</h3>
      <div style={{ border: "1px solid gray", height: 150, overflowY: "scroll", padding: 5 }}>
        {chatMessages.map((msg, i) => (
          <div key={i}><strong>{msg.nickname}</strong>: {msg.msg}</div>
        ))}
      </div>
      <input
        placeholder="메시지 입력"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onKeyDown={handleSendChat}
      />
    </div>
  );
}

export default GameRoom;