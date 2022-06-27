import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// styles from Notus template
import "./assets/styles/tailwind.min.css";
import "./assets/styles/docs.css";

//
import RoutePage from "./RoutePage";


ReactDOM.render(
  <HashRouter>
    <Switch>

      {/* Custom Routes added */}
      <Route exact path="/:id" render={(props) => ( <RoutePage page={props.match.params.id}/>)} />

      <Redirect from="*" to="/index" />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
