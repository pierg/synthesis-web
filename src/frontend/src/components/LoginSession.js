import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "./elements/Button.js";
import { Form } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useSocket } from "../socket/SocketProvider";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";

export default function LoginSession({ id, onIdSubmit, cookie }) {
  const idRef = useRef();

  const socket = useSocket();

  const [errorMsg, setErrorMsg] = useState("");

  const handleAnswer = useCallback(
    (answer) => {
      answer
        ? onIdSubmit(idRef.current.value)
        : setErrorMsg("This session doesn't exist or it is being used.");
    },
    [onIdSubmit]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e) {
    e.preventDefault();

    socket.emit("session-existing", idRef.current.value);

    socket.on("receive-answer", handleAnswer);

    return () => {
      socket.off("receive-answer");
    };
  }

  const createNewId = useCallback(() => {
    onIdSubmit(uuidV4());
  }, [onIdSubmit]);

  useEffect(() => {
    idRef.current.value = "";
  }, [id]);

  useEffect(() => {
    if (id === undefined) {
      createNewId();
    }
  }, [createNewId, id]);

  const [toolTipText, setToolTipText] = useState(true);
  const [toolTipColor, setToolTipColor] = useState("text-lightBlue-700");

  function animateId() {
    setToolTipColor("text-white");
    setTimeout(function () {
      setToolTipColor("text-lightBlue-700");
    }, 300);
  }

  const toggleToolTipText = (reset) => {
    if (toolTipText !== reset) setToolTipText(reset);
    if (!reset) animateId();
  };

  return (
    <>
      <p className="text-center mt-4">Your Session ID is:</p>

      {id !== undefined && (
        <SwitchTransition mode="out-in">
          <CSSTransition
            classNames="fade"
            addEndListener={(node, done) => {
              node.addEventListener("transitionend", done, false);
            }}
            key={id.split("-")[0] + "-" + id.split("-")[1] + "..."}
          >
            <>
              <Tooltip
                html={<div>{toolTipText ? "Click to Copy ID" : "ID Copied!"}</div>}
                position="bottom"
                arrow="true"
              >
                <p
                  className={
                    "text-center font-semibold hover:text-lightBlue-500 cursor-pointer transition-all duration-300 ease-in-out " +
                    toolTipColor
                  }
                  onClick={() => {
                    navigator.clipboard
                      .writeText(id)
                      .then(() => toggleToolTipText(false));
                  }}
                  onMouseOut={() =>
                    setTimeout(function () {
                      toggleToolTipText(true);
                    }, 500)
                  }
                >
                  {id.split("-")[0] + "-" + id.split("-")[1] + "..."}
                </p>
              </Tooltip>
            </>
          </CSSTransition>
        </SwitchTransition>
      )}

      <Form onSubmit={handleSubmit} className="w-full mt-4">
        <Form.Group>
          <Form.Control
            type="text"
            className="border-lightBlue-200"
            ref={idRef}
            id={"inputSession"}
            required
            onChange={() => setErrorMsg("")}
            placeholder={"Load another session"}
          />
          <span className="text-red-500 text-xs mt-1">{errorMsg}</span>
        </Form.Group>
        <div className="flex w-full justify-center p-2">
          <Button onClick={createNewId} color="teal" variant="secondary" type="reset">
            Reset
          </Button>
          <Button type="submit" color="lightBlue" id="loadButton">
            Load
          </Button>
        </div>
      </Form>
    </>
  );
}
