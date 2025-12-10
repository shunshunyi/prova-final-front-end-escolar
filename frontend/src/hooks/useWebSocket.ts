
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useWebSocket = () => {
    // Use a ref to keep the socket instance across renders
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return { socket: socketRef.current, isConnected };
};
