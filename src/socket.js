import { io } from "socket.io-client";
const socket = io("https://tictactoe-server-htl6.onrender.com");
// const socket = io("http://localhost:3002");
export default socket;