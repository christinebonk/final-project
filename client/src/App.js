import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Monthly from "./pages/Monthly";
import Transaction from "./pages/Transaction";


const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/test" component={Budget} />
        <Route exact path="/monthly" component={Monthly} />
        <Route exact path="/transaction" component={Transaction} />

      </Switch>
    </div>
  </Router>
);

export default App;


