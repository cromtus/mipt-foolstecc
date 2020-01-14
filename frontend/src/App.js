import React from "react";
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Nearby from './pages/Nearby'
import Explore from './pages/Explore'


const App = () => (
  <Router>
    <Switch>
      <Route path="/nearby">
        <Nearby />
      </Route>
      <Route path="/:route_id">
        <Explore />
      </Route>
      <Route path="/">
        <Redirect to='/nearby' />
      </Route>
    </Switch>
  </Router>
)

export default App