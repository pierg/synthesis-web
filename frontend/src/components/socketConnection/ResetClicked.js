import React, {useCallback, useEffect} from 'react'
import {useSocket} from "../../socket/SocketProvider";

function SocketResetClicked(props) {
    const socket = useSocket()

    const setLines = useCallback((lines) => {
        socket.off('reset-done')
        props.emptyLines()
        props.setTriggerGetInput(true);
    }, [props,socket]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger) {
            props.setTrigger(false)

            if(props.mode === "strix"){
                socket.emit("reset-controller",{name: props.name, mode: props.mode})
            }

            socket.on('reset-done', setLines)
        }

    }, [socket, props, setLines])

    return (<></>);
}

export default SocketResetClicked;