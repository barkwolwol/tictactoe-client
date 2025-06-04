import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLobbySocket from "../hooks/useLobbySocket";
import useChat from "../hooks/useChat";
import "../styles/Lobby.css";

function Lobby() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [roomName, setRoomName] = useState("");

  const { userList, roomList, setNickname: emitNickname, createRoom, joinRoom } = useLobbySocket(navigate);

  const {
    chatInput,
    setChatInput,
    chatMessages,
    sendChat,
    handleSendChat,
    chatBoxRef,
  } = useChat("lobbyMessage");

  const handleSetNickname = () => {
    emitNickname(nickname);
  };

  const handleCreateRoom = () => {
    createRoom(roomName);
  };

  return (
    <div className="lobby-container">
      <h2>대기실</h2>

      <div className="input-group">
        <input
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button onClick={handleSetNickname}>확정</button>
      </div>

      <h3>접속 중인 유저</h3>
      <ul className="user-list">
        {userList.map((nick, i) => (
          <li key={i}>{nick}</li>
        ))}
      </ul>

      <h3>채팅</h3>
      <div ref={chatBoxRef} className="chat-box">
        {chatMessages.map((msg, i) => (
          <div key={i} className="chat-message">
            <strong>{msg.nickname}</strong>: {msg.msg}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          placeholder="메시지 입력"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleSendChat}
        />
        <button onClick={sendChat}>전송</button>
      </div>

      <h3>방 만들기</h3>
      <div className="input-group">
        <input
          placeholder="방 이름"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>생성</button>
      </div>

      <h3>방 목록</h3>
      <ul className="room-list">
        {roomList.map((room, i) => (
          <li key={i}>
            {room} <button onClick={() => joinRoom(room)}>입장</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
