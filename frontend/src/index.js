import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/styles/bootstrap.min.css";
import "./assets/scss/now-ui-kit.css";
import "./assets/styles/custom.css";
// styles from Notus template
import "./assets/styles/tailwind.css";
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
