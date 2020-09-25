import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import TddNotebook from './components/TddNotebook';
import './App.css';


function App() {
  return (
      <Router>
      <div>
        <Switch>
          <Route path="/tdd-notebook">
            <TddNotebook />
          </Route>
          <Route path="/">
            <TddNotebook />
          </Route>
        </Switch>
      </div>
    </Router>
     
  );
}

export default App;
