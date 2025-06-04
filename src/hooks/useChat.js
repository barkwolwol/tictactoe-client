import { useState, useEffect, useRef } from "react";
import socket from "../socket"; // 경로 주의

function useChat(eventName, roomName = null) {
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const eventRef = useRef(eventName + (roomName ? `:${roomName}` : ""));
    const chatBoxRef = useRef(null);

    useEffect(() => {
        const handler = (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        };

        socket.on(eventName, handler);

        return () => {
            socket.off(eventName, handler);
        };
    }, [eventName]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const sendChat = () => {
        if (chatInput.trim()) {
            const payload = roomName
                ? { roomName, msg: chatInput }
                : chatInput;

            socket.emit(eventName, payload);
            setChatInput("");
        }
    };

    const handleSendChat = (e) => {
        if (e.key === "Enter") {
            sendChat();
        }
    };

    return {
        chatInput,
        setChatInput,
        chatMessages,
        sendChat,
        handleSendChat,
        chatBoxRef,
    };
}

export default useChat;
