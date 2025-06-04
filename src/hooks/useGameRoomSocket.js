import { useEffect, useState } from "react";
import socket from "../socket";

function useGameRoomSocket(roomName) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.on("boardUpdate", ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
    });

    socket.on("gameOver", setWinner);

    return () => {
      socket.off("boardUpdate");
      socket.off("gameOver");
    };
  }, [roomName]);

  const makeMove = (index) => {
    if (!winner) {
      socket.emit("makeMove", { roomName, index });
    }
  };

  return {
    board,
    currentTurn,
    winner,
    makeMove,
  };
}

export default useGameRoomSocket;
