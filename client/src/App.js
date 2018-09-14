import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Budget from "./pages/Budget";

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/app" component={Home} />
        <Route exact path="/app/budget" component={Budget} />

      </Switch>
    </div>
  </Router>
);

export default App;


