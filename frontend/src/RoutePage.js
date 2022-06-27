import React from "react";

import {SocketProvider, ConnectorProvider} from "./socket/SocketProvider";
import useLocalStorage from "./hooks/useLocalStorage";

// components
import CustomSidebar from "./components/CustomSidebar";
import LandingPageSynthesis from "./views/LandingPageSynthesis";
import CustomSynthesis from "./views/CustomSynthesis";
import customsidebar from "./_texts/customsidebar";

export default function RoutePage(props) {
    const [id, setId] = useLocalStorage('id')
    const [cookie] = useLocalStorage('cookie')
    const tabId =   sessionStorage.tabID ?
                    sessionStorage.tabID :
                    sessionStorage.tabID = Math.random()

    return (
        <SocketProvider id={id} cookie={cookie} tabId={tabId}>
            <ConnectorProvider setId={setId}/>
            <CustomSidebar
                {...customsidebar}
                id={id}
                setId={setId}
                cookie={cookie}
            />
            <div className="relative xxl:ml-64 bg-blueGray-100 min-h-screen">
                {(() => {
                    switch (props.page) {
                        case 'synthesis':
                            return (
                                <CustomSynthesis/>
                            )
                        default:
                            return (
                                <LandingPageSynthesis/>
                            )
                    }
                })()}
            </div>
        </SocketProvider>
    );
}
