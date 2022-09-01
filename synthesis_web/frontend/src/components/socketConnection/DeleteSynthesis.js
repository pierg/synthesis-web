import React, { useEffect, useCallback } from "react";
import { useSocket } from "../../socket/SocketProvider";
import "react-toastify/dist/ReactToastify.css";

function SocketDeleteSynthesis(props) {
  const socket = useSocket();

  const deletedFinish = useCallback(
    (bool) => {
      props.setTrigger(false);
      if (bool) {
        props.deletedDone();
      }
    },
    [props]
  ); // eslint-disable-next-line

  useEffect(() => {
    if (socket == null) return;

    if (props.trigger) {
      if (props.modeToDelete === 0) {
        socket.emit("delete-synthesis", {
          mode: "parallel",
          name: props.creation.label,
          assumptions: props.creation.assumptions,
          guarantees: props.creation.guarantees,
          inputs: props.creation.inputs,
          outputs: props.creation.outputs,
        });
      } else {
        socket.emit("delete-synthesis", {
          mode: "strix",
          name: props.creation.label,
          assumptions: props.creation.assumptions,
          guarantees: props.creation.guarantees,
          inputs: props.creation.inputs,
          outputs: props.creation.outputs,
        });
      }

      socket.on("synthesis-deleted", deletedFinish);
    }
  }, [socket, props, deletedFinish]);

  return <></>;
}

export default SocketDeleteSynthesis;
