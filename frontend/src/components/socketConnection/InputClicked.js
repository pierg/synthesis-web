import React, {useCallback, useEffect} from 'react'
import {useSocket} from "../../socket/SocketProvider";

function SocketInputClicked(props) {
    const socket = useSocket()

    const setLine = useCallback((line) => {
        if(props.mode === "strix"){
            socket.off('controller-simulated')
        }
        props.setLine(line);
        props.setTriggerGetInput(true);
    }, [props,socket]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger) {
            props.setTrigger(false)

            if(props.mode === "strix"){
                socket.emit("simulate-controller",{
                    mode: props.mode,
                    name: props.name,
                    assumptions: props.assumptions,
                    guarantees: props.guarantees,
                    inputs: props.inputs,
                    outputs: props.outputs,
                    choice: props.choice
                })
                socket.on('controller-simulated', setLine)
            }

        }

    }, [socket, props, setLine])

    return (<></>);
}

export default SocketInputClicked;