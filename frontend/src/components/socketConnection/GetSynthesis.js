import React, {useCallback, useEffect} from 'react'
import {useSocket} from "../../socket/SocketProvider";

function SocketGetSynthesis(props) {
    const socket = useSocket()

    const setGraph = useCallback((graph) => {
        if(graph) {
            props.setGraph(graph);
        }
        if (props.strix) {
            socket.off('controller-created-strix')
        }
        else {
            socket.off('controller-created-crome')
        }
    }, [props,socket]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger && props.name !== "") {
            if (props.strix) {
                socket.emit("controller-strix", props.name)
                socket.on('controller-created-strix', setGraph)
            } else {
                socket.emit("controller-crome", props.name)
                socket.on('controller-created-crome', setGraph)
            }

            props.setTrigger(false)

            return () => socket.off('graph-generated')
        }

    }, [socket, props, setGraph])

    return (<></>);
}

export default SocketGetSynthesis;