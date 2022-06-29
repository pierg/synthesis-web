import React, {useCallback, useEffect} from 'react'
import {useSocket} from "../../socket/SocketProvider";

function SocketGetExamples(props) {
    const socket = useSocket()

    const setTree = useCallback((tree) => {
        console.log(tree)
        props.setTree(tree);
    }, [props]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger) {
            props.setTrigger(false)
            if(!props.controllers) {
                socket.emit("get-synthesis")
                socket.on('receive-synthesis', setTree)
            }
            else {
                socket.emit("get-controller")
                socket.on('receive-controller', setTree)
            }

            return () => socket.off('graph-generated')
        }

    }, [socket, props, setTree])

    return (<></>);
}

export default SocketGetExamples;