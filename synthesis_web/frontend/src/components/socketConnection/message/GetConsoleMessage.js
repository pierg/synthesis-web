import React, { useEffect, useCallback, useState } from "react";
import { useSocket } from "../../../socket/SocketProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SocketIoConsoleMessage(props) {
  const socket = useSocket();

  const [message, setMessage] = useState("");

  const setMessageFunction = useCallback(
    (message_received) => {
      setMessage(message_received);
    },
    [setMessage]
  );

  const setNotificationFunction = useCallback((message_received) => {
    toast[message_received["crometypes"]](message_received["content"]);
  }, []);

  useEffect(() => {
    // CONSOLE MESSAGE
    if (socket == null) return;

    socket.on("send-message", setMessageFunction);

    return () => {
      socket.off("send-message");
    };
  }, [socket, setMessageFunction, props.session]);

  useEffect(() => {
    // NOTIFICATION MESSAGE (TOAST)
    if (socket == null) return;

    socket.on("send-notification", setNotificationFunction);

    return () => {
      socket.off("send-message");
    };
  }, [socket, setNotificationFunction, props.session]);

  useEffect(() => {
    props.modifyMessage(message);
  }, [message]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ToastContainer />
    </>
  );
}

export default SocketIoConsoleMessage;
