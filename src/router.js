import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

/* eslint-disable import/no-unresolved */
import {
  RouteHookAuth,
  RouteHookLogin,
} from '@/routeHook';

import Login from '@/component/auth/login';
import InnerHeader from '@/component/inner/inner-header';
import Dashboard from '@/component/dashboard/dashboard';
import DashFolder from '@/component/dash-folder/dash-folder';
import Setting from '@/component/setting/setting';

export default () => (
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
                <Switch>

                  <Route path="/inner/setting" component={RouteHookAuth(Setting)} />
                  <Route path="/inner/dashboard/:id" component={RouteHookAuth(DashFolder)} />
                  <Route path="/inner/dashboard" component={RouteHookAuth(Dashboard)} />
                  <Route path="/inner" exact component={RouteHookAuth(Dashboard)} />

                </Switch>
              </div>

            </div>
          ))}
        />

        <Route
          path="/"
          component={RouteHookLogin(() => (
            <div className="auth-wrap">
              <Switch>

                <Route path="/login" component={RouteHookLogin(Login)} />
                <Route path="/" exact component={RouteHookLogin(Login)} />

              </Switch>
            </div>
          ))}
        />

      </Switch>
    </div>
  </Router>
)
