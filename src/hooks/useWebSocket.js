import { useEffect, useState } from "react";

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  /*
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };
    return () => {
      if (ws) ws.close();
    };
  }, [url]);
  */
  return socket;
};

export default useWebSocket;
