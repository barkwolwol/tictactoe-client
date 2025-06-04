import { useEffect, useState } from "react";
import socket from "../socket";

function useLobbySocket(navigate) {
  const [userList, setUserList] = useState([]);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    socket.on("userList", setUserList);
    socket.on("roomList", setRoomList);
    socket.on("roomCreated", (room) => navigate(`/game/${room}`));
    socket.on("startGame", (room) => navigate(`/game/${room}`));
    socket.emit("getRoomList");

    return () => {
      socket.off("userList", setUserList);
      socket.off("roomList", setRoomList);
      socket.off("roomCreated");
      socket.off("startGame");
    };
  }, [navigate]);

  const setNickname = (nickname) => {
    if (nickname.trim()) {
      socket.emit("setNickname", nickname);
    }
  };

  const createRoom = (roomName) => {
    if (roomName.trim()) {
      socket.emit("createRoom", roomName);
    }
  };

  const joinRoom = (room) => {
    socket.emit("joinRoom", room);
  };

  return {
    userList,
    roomList,
    setNickname,
    createRoom,
    joinRoom,
  };
}

export default useLobbySocket;
