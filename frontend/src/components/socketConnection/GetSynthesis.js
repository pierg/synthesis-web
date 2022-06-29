import React, {useCallback, useEffect} from 'react'
import {useSocket} from "../../socket/SocketProvider";

function SocketGetSynthesis(props) {
    const socket = useSocket()

    const setGraph = useCallback((graph) => {
        if(graph) {
            props.setGraph(graph);
        }
        else {
            props.setGraph(null);
        }
        if(props.controllers) {
            socket.off('receive-controller-mealy')
        }
        else {
            socket.off('controller-created')
        }
    }, [props,socket]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger && props.name !== "") {
            if(props.controllers) {
            console.log('props.controllers')
            console.log(props.controllers)
                socket.emit("controller-mealy", {name : props.name, mode : props.controllers})
                socket.on('receive-controller-mealy', setGraph)
            }
            else {
                if (props.strix) {
                    socket.emit("create-controller", {name : props.name, mode : "strix"})
                }
                else if(props.parallel) {
                    socket.emit("create-controller", {name : props.name, mode : "parallel"})
                }
                socket.on('controller-created', setGraph)
            }

            props.setTrigger(false)

            return () => socket.off('graph-generated')
        }

    }, [socket, props, setGraph])

    return (<></>);
}

export default SocketGetSynthesis;