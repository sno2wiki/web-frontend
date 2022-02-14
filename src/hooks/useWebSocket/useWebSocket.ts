import { useEffect, useRef, useState } from "react";

export const useWebSocket = (
  endpoint: string,
  { onMessage, onOpen, onClose, onError }: {
    onOpen?: (event: Event, ws: WebSocket) => void;
    onMessage?: (event: MessageEvent, ws: WebSocket) => void;
    onClose?: (event: CloseEvent, ws: WebSocket) => void;
    onError?: (event: Event, ws: WebSocket) => void;
  },
): [WebSocket | undefined, boolean] => {
  const wsRef = useRef<WebSocket | undefined>(undefined);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (online) return;

    const newSocket = new WebSocket(endpoint);
    newSocket.addEventListener("open", (event) => {
      setOnline(true);
      if (onOpen) onOpen(event, newSocket);
    });
    newSocket.addEventListener("message", (event) => {
      setOnline(true);
      if (onMessage) onMessage(event, newSocket);
    });
    newSocket.addEventListener("close", (event) => {
      setOnline(false);
      if (onClose) onClose(event, newSocket);
    });
    newSocket.addEventListener("error", (event) => {
      setOnline(false);
      if (onError) onError(event, newSocket);
    });
    wsRef.current = newSocket;
  }, [endpoint, onMessage, onOpen, onClose, onError, online]);

  return [wsRef.current, online];
};
