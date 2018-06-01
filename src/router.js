import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import {
  RouteHookAuth,
  RouteHookLogin,
} from '@/routeHook';

import Login from '@/component/auth/login';
import InnerHeader from '@/component/inner/inner-header';
import Dashboard from '@/component/dashboard/dashboard';
import Setting from '@/component/setting/setting';

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
                <Route path="/inner/setting" component={RouteHookAuth(Setting)} />
                <Route path="/inner/dashboard" component={RouteHookAuth(Dashboard)} />
                <Route path="/inner" exact component={RouteHookAuth(Dashboard)} />
              </div>

            </div>
          ))}
        />

        <Route
          path="/"
          component={RouteHookLogin(() => (
            <div className="auth-wrap">

              <Route path="/login" component={RouteHookLogin(Login)} />
              <Route path="/" exact component={RouteHookLogin(Login)} />

            </div>
          ))}
        />

      </Switch>
    </div>
  </Router>
)
