import React from "react";
import { useParams } from "react-router-dom";
import useGameRoomSocket from "../hooks/useGameRoomSocket";
import useChat from "../hooks/useChat";
import "../styles/GameRoom.css";

function GameRoom() {
  const { roomName } = useParams();

  const { board, currentTurn, winner, makeMove } = useGameRoomSocket(roomName);

  const {
    chatInput,
    setChatInput,
    chatMessages,
    handleSendChat,
    sendChat,
    chatBoxRef,
  } = useChat("gameMessage", roomName);

  const handleClick = (index) => {
    if (!winner && board[index] === null) {
      makeMove(index);
    }
  };

  return (
    <div className="game-room-container">
      <h2>게임방: {roomName}</h2>
      {winner ? (
        <h3>{winner === "draw" ? "무승부!" : `${winner} 승리!`}</h3>
      ) : (
        <h3>턴: {currentTurn}</h3>
      )}

      <div className="board">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!winner || cell !== null}
          >
            {cell}
          </button>
        ))}
      </div>

      <h3>채팅</h3>
      <div ref={chatBoxRef} className="chat-box">
        {chatMessages.map((msg, i) => (
          <div key={i} className="chat-message">
            <strong>{msg.nickname}</strong>: {msg.msg}
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          placeholder="메시지 입력"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleSendChat}
        />
        <button onClick={sendChat}>전송</button>
      </div>
    </div>
  );
}

export default GameRoom;
