import React from "react";

import {SocketProvider, ConnectorProvider} from "./socket/SocketProvider";
import useLocalStorage from "./hooks/useLocalStorage";

// components
import Specifications from "./views/Specifications";
import Controllers from "./views/Controllers";
import Synthetise from "./views/Synthetise";
import LandingPage from "./views/LandingPage";
import Header from "./component/Header";

export default function RoutePage(props) {
    const [id, setId] = useLocalStorage('id')
    const [cookie] = useLocalStorage('cookie')
    const tabId =   sessionStorage.tabID ?
                    sessionStorage.tabID :
                    sessionStorage.tabID = Math.random()
    const headerStates = [true, false, false, false]

    const onSelectCustomHeader = (activeHeaderIndex, clickable, statTitle) => {

        if (!this.state.headerStates[activeHeaderIndex] && clickable) {
            let newHeaderStates = Array(this.state.headerStates.length).fill(false);
            newHeaderStates[activeHeaderIndex] = true

            this.setState({
                activeHeaderIndex: activeHeaderIndex,
                project: statTitle,
                headerStates:
                newHeaderStates, cgg: false
            })
        }
    }

    return (
        <SocketProvider id={id} cookie={cookie} tabId={tabId}>
            <ConnectorProvider setId={setId}/>
            <Header
                {...customcontractsheaderscards}
                color={"emerald"}
                states={headerStates}
                clickable={true}
                onSelectCustomHeader={onSelectCustomHeader}
            />
            <div className="relative xxl:ml-64 bg-blueGray-100 min-h-screen">
                {(() => {
                    switch (props.page) {
                        case 'specification':
                            return (
                                <Specifications/>
                            )
                        case 'controllers':
                            return (
                                <Controllers/>
                            )
                        case 'synthetise':
                            return (
                                <Synthetise/>
                            )
                        default:
                            return (
                                <LandingPage/>
                            )
                    }
                })()}
            </div>
        </SocketProvider>
    );
}
