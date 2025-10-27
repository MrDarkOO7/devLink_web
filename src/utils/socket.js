import { io } from "socket.io-client";
import { API_BASE } from "./api";

const SOCKET_URL = API_BASE;

export const createSocketConnection = () => {
  return io(
    SOCKET_URL
    //     {
    //     transports: ['websocket'],
    //     autoConnect: false,
    // }
  );
};
