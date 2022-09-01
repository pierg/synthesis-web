import React, { useCallback, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 as uuidV4 } from "uuid";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ id, cookie, tabId, children }) {
  useEffect(() => {
    console.log("Connecting merged");
    console.log(id);
    const newSocket = io("http://127.0.0.1:5000", { query: { id, cookie, tabId } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [id, cookie, tabId]);

  const [socket, setSocket] = useState();

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function ConnectorProvider({ setId }) {
  const check_connected = useCallback(
    (answer) => {
      if (!answer) {
        setId(uuidV4());
      }
    },
    [setId]
  );
  const socket = useSocket();

  useEffect(() => {
    if (socket == null) return;

    socket.on("is-connected", check_connected);
  });

  return <></>;
}
