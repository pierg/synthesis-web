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
        socket.off('controller-created')
    }, [props,socket]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger && props.name !== "") {
            if (props.strix) {
                socket.emit("create-controller", {
                    mode : "strix",
                    name: props.name,
                    assumptions: props.assumptions,
                    guarantees: props.guarantees,
                    inputs: props.inputs,
                    outputs: props.outputs,
                })
            }
            else if(props.parallel) {
                socket.emit("create-controller", {name : props.name, mode : "parallel"})
            }
            socket.on('controller-created', setGraph)

            props.setTrigger(false)

            return () => socket.off('graph-generated')
        }

    }, [socket, props, setGraph])

    return (<></>);
}

export default SocketGetSynthesis;