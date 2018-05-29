import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import login from './component/auth/login';

export default () => (
  <Router>
    <div className="router-wrap">
      <Route path="/" exact component={login} />
      <Route path="/login" component={login} />
    </div>
  </Router>
)
