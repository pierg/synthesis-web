import React, {useEffect, useCallback} from 'react'
import {useSocket} from "../../socket/SocketProvider";
import 'react-toastify/dist/ReactToastify.css';

function SocketSaveSynthesis(props) {

    const socket = useSocket()

    const savedFinish = useCallback((bool) => {
        if(bool) {
            props.savedDone();
        }
        socket.off('synthesis-saved')
    }, [props,socket]) // eslint-disable-next-line

    useEffect(() => {
        if (socket == null) return

        if (props.trigger) {
            props.setTrigger(false);
            socket.emit('save-synthesis', {
                    name: props.name,
                    assumptions: props.assumptions,
                    guarantees: props.guarantees,
                    inputs: props.inputs,
                    outputs: props.outputs,
            })

            socket.on('synthesis-saved', savedFinish)
        }

    }, [socket, props, savedFinish])

    return (<></>);
}

export default SocketSaveSynthesis;
