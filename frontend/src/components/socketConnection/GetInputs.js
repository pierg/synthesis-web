import React, {useCallback, useEffect} from 'react'
import {useSocket} from "../../socket/SocketProvider";

function SocketGetInputs(props) {
    const socket = useSocket()

    const setInputs = useCallback((inputs) => {
        socket.off('received-inputs')
        props.setInputs(inputs);
    }, [props,socket]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger) {
            props.setTrigger(false)

            if(props.mode === "strix"){
                socket.emit("get-inputs",{
                    mode: props.mode,
                    name: props.name,
                    assumptions: props.assumptions,
                    guarantees: props.guarantees,
                    inputs: props.inputs,
                    outputs: props.outputs,
                })
            }

            socket.on('received-inputs', setInputs)

            return () => socket.off('received-inputs-other')
        }

    }, [socket, props, setInputs])

    return (<></>);
}

export default SocketGetInputs;