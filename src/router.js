import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import RouteHookAuth from './routeHook';

import Login from './component/auth/login';
import InnerHeader from './component/inner/inner-header';
import Dashboard from './component/dashboard/dashboard';

export const Root = () => (
  <Router>
    <div className="router-wrap">
      <Switch>

        <Route
          path="/inner"
          component={RouteHookAuth(() => (
            <div className="inner-wrap">

              <div className="inner-head-wrap">
                <InnerHeader />
              </div>

              <div className="inner-page-wrap">
                <Route path="/inner/dashboard" component={Dashboard} />
                <Route path="/inner" exact component={Dashboard} />
              </div>

            </div>
          ))}
        />

        <Route
          path="/"
          render={() => (
            <div className="auth-wrap">

              <Route path="/login" component={Login} />
              <Route path="/" exact component={Login} />

            </div>
          )}
        />

      </Switch>
    </div>
  </Router>
)
