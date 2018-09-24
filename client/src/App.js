import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Budget from "./pages/Budget";
import Monthly from "./pages/Monthly";



const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/overview" component={Budget} />
        <Route exact path="/monthly" component={Monthly} />


      </Switch>
    </div>
  </Router>
);

export default App;


