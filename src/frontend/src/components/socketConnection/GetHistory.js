import React, { useCallback, useEffect } from "react";
import { useSocket } from "../../socket/SocketProvider";

function SocketGetHistory(props) {
  const socket = useSocket();

  const setLines = useCallback(
    (lines) => {
      if (props.mode === "strix") {
        socket.off("received-history");
      }
      props.setLine(lines);
    },
    [props, socket]
  ); // eslint-disable-next-line

  useEffect(() => {
    if (socket == null) return;

    if (props.trigger) {
      props.setTrigger(false);

      if (props.mode === "strix") {
        socket.emit("get-history", {
          mode: props.mode,
          name: props.name,
          assumptions: props.assumptions,
          guarantees: props.guarantees,
          inputs: props.inputs,
          outputs: props.outputs,
          iterations: props.number,
        });
        socket.on("received-history", setLines);
      }
    }
  }, [socket, props, setLines]);

  return <></>;
}

export default SocketGetHistory;
