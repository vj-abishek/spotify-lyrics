import React from 'react';
import Login from './Components/Login';
import Lyrics from './Components/LyricsComp';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      {localStorage.access_token !== undefined && <Redirect to='/lyrics' />}
      <Switch>
        <Route exact path='/' component={Login} />

        <Route path='/lyrics' component={Lyrics} />
      </Switch>
    </Router>
  );
}

export default App;
