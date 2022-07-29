import React from "react";

import { SocketProvider, ConnectorProvider } from "./socket/SocketProvider";
import useLocalStorage from "./hooks/useLocalStorage";

// components
import consoleinfo from "./_texts/console";
import SocketIoConsoleMessage from "./components/socketConnection/message/GetConsoleMessage";
import Console from "./components/custom/Console";

import CustomSidebar from "./components/CustomSidebar";
import LandingPageSynthesis from "./views/LandingPageSynthesis";
import CustomSynthesis from "./views/CustomSynthesis";
import customsidebar from "./_texts/customsidebar";
import { useParams } from "react-router";
import { Navigate } from "react-router";

export default function RoutePage() {
  const page = useParams().id;
  const [id, setId] = useLocalStorage("id");
  const [cookie] = useLocalStorage("cookie");
  const tabId = sessionStorage.tabID
    ? sessionStorage.tabID
    : (sessionStorage.tabID = Math.random());
  let [message, setMessage] = React.useState("");

  function updateMessage(msg) {
    if (message === "") {
      setMessage(msg);
    } else {
      setMessage(message + "\n" + msg);
    }
  }

  return (
    <SocketProvider id={id} cookie={cookie} tabId={tabId}>
      <ConnectorProvider setId={setId} />
      <CustomSidebar
        page={page}
        {...customsidebar}
        id={id}
        setId={setId}
        cookie={cookie}
      />
      <Console {...consoleinfo} customText={message} />
      <SocketIoConsoleMessage modifyMessage={(e) => updateMessage(e)} session={id} />
      <div className="relative bg-blueGray-100 min-h-screen">
        {(() => {
          switch (page) {
            case "synthesis":
              return <CustomSynthesis />;
            case "index":
              return <LandingPageSynthesis />;
            default:
              return <Navigate to="index" />;
          }
        })()}
      </div>
    </SocketProvider>
  );
}
