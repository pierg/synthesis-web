import React, { useCallback, useEffect } from "react";
import { useSocket } from "../../socket/SocketProvider";

function SocketGetExamples(props) {
  const socket = useSocket();

  const setTree = useCallback(
    (tree) => {
      props.setTree(tree);
    },
    [props]
  ); // eslint-disable-next-line

  useEffect(() => {
    if (socket == null) return;

    if (props.trigger) {
      props.setTrigger(false);
      socket.emit("get-synthesis");
      socket.on("receive-synthesis", setTree);

      return () => socket.off("graph-generated");
    }
  }, [socket, props, setTree]);

  return <></>;
}

export default SocketGetExamples;
