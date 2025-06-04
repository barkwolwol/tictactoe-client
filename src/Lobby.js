import React, { useEffect, useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";

function Lobby() {
  const [nickname, setNickname] = useState("");
  const [userList, setUserList] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("userList", setUserList);
    socket.on("roomList", setRoomList);
    socket.on("lobbyMessage", (msg) => setChatMessages((prev) => [...prev, msg]));
    socket.on("roomCreated", (room) => navigate(`/game/${room}`));
    socket.on("startGame", (room) => navigate(`/game/${room}`));
    socket.emit("getRoomList");

    return () => {
      socket.off("userList");
      socket.off("roomList");
      socket.off("lobbyMessage");
      socket.off("roomCreated");
      socket.off("startGame");
    };
  }, [navigate]);

  const handleSetNickname = () => {
    if (nickname.trim()) {
      socket.emit("setNickname", nickname);
    }
  };

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      socket.emit("createRoom", roomName);
    }
  };

  const handleJoinRoom = (room) => {
    socket.emit("joinRoom", room);
  };

  const handleSendChat = (e) => {
    if (e.key === "Enter" && chatInput.trim()) {
      socket.emit("lobbyMessage", chatInput);
      setChatInput("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>대기실</h2>
      <input
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={handleSetNickname}>확정</button>

      <h3>접속 중인 유저</h3>
      <ul>
        {userList.map((nick, i) => (
          <li key={i}>{nick}</li>
        ))}
      </ul>

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

      <h3>방 만들기</h3>
      <input
        placeholder="방 이름"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>생성</button>

      <h3>방 목록</h3>
      <ul>
        {roomList.map((room, i) => (
          <li key={i}>
            {room} <button onClick={() => handleJoinRoom(room)}>입장</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;