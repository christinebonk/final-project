import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Budget from "./pages/Budget";

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/test" component={Budget} />
      </Switch>
    </div>
  </Router>
);

export default App;

