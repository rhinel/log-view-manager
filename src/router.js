import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import login from './component/auth/login';

export default () => (
  <Router>
    <div className="router-wrap">
      <Switch>
        <Route path="/inner" render={() => (
          <div className="inner-wrap">
            <div className="inner-head-wrap">
              头部
            </div>
            <div className="inner-page-wrap">
              内部页面
            </div>
          </div>
        )} />

        <Route path="/" render={() => (
          <div className="auth-wrap">
            <Route path="/login" component={login} />
            <Route path="/" exact component={login} />
          </div>
        )} />
      </Switch>
    </div>
  </Router>
)
