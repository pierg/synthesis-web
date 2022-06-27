import React, {useCallback, useEffect} from 'react'
import {useSocket} from "../../socket/SocketProvider";

function SocketInputClicked(props) {
    const socket = useSocket()

    const setLine = useCallback((line) => {
        if(props.mode === "crome") {
            socket.off('crome-simulated')
        }
        else if(props.mode === "strix"){
            socket.off('mealy-simulated')
        }
        props.setLine(line);
        props.setTriggerGetInput(true);
    }, [props,socket]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger) {
            props.setTrigger(false)

            if(props.mode === "strix"){
                socket.emit("simulate-controller",{name: props.name, mode: props.mode, input: props.input})
                socket.on('mealy-simulated', setLine)
            }

        }

    }, [socket, props, setLine])

    return (<></>);
}

export default SocketInputClicked;