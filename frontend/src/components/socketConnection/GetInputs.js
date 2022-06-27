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
                socket.emit("get-inputs",{name: props.name, mode: props.mode})
            }

            socket.on('received-inputs', setInputs)

            return () => socket.off('received-inputs-other')
        }

    }, [socket, props, setInputs])

    return (<></>);
}

export default SocketGetInputs;