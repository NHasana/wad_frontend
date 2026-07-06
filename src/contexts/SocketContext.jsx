import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { TokenStore } from "../lib/tokenStore";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    function connectSocket() {
      const token = TokenStore.getAccessToken();

      console.log("========== SOCKET INIT ==========");
      console.log("Access Token:", token);

      if (!token) {
        console.warn("❌ Tidak ada access token");
        setIsConnected(false);
        return;
      }

      // kalau sudah ada socket lama, tutup dulu
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const socketInstance = io(import.meta.env.VITE_API_URL, {
        transports: ["websocket"],
        auth: {
          token,
        },
      });

      socketRef.current = socketInstance;
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("🟢 SOCKET CONNECTED");
        console.log("Socket ID:", socketInstance.id);
        setIsConnected(true);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("🔴 SOCKET DISCONNECTED");
        console.log(reason);
        setIsConnected(false);
      });

      socketInstance.on("connect_error", (err) => {
        console.error("🚨 SOCKET ERROR");
        console.error(err.message);
        setIsConnected(false);
      });

      socketInstance.on("users:online", ({ count }) => {
        console.log("👥 Online:", count);
        setOnlineCount(count);
      });
    }

    // pertama kali
    connectSocket();

    // setelah login
    window.addEventListener("login-success", connectSocket);

    // setelah refresh token
    const handleRefresh = (e) => {
      console.log("🔄 Refresh Token");

      if (!socketRef.current) return;

      socketRef.current.auth = {
        token: e.detail.token,
      };

      socketRef.current.disconnect();
      socketRef.current.connect();
    };

    window.addEventListener(
      "token:refreshed",
      handleRefresh
    );

    return () => {
      window.removeEventListener(
        "login-success",
        connectSocket
      );

      window.removeEventListener(
        "token:refreshed",
        handleRefresh
      );

      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket harus digunakan di dalam SocketProvider"
    );
  }

  return context;
}