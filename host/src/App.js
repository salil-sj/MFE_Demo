import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div>
        <h1>Host Application</h1>
        <Switch>
          <Route exact path="/" component={Home} />
          {/* You can add more routes here if needed */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
