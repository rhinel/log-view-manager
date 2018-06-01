import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Message } from 'element-react';
import Qs from 'query-string';
import C from '@/common/config';
import Request from '@/common/request';

let RoutePathname = '';

const RouteHookLogin = (loginComponent) => {
  class RouteHookLogin extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
        auth: true,
      };
    }

    async componentDidMount() {
      await this.checkAuth();

      loginComponent.displayName = 'RouteHookAuthLogin';

      this.setState({
        component: loginComponent,
      });
    }

    async checkAuth() {
      if (RoutePathname !== window.location.pathname) {
        RoutePathname = window.location.pathname;
        const token = localStorage.getItem(`${C.Storage}token`);
        if (!token) {
          return;
        }

        try {
          await Request('/inner/auth/check');
        } catch (err) {
          console.log(err);
          return;
        }
      }

      this.setState({
        auth: false,
      });
    }

    render() {
      const Component = this.state.component;
      const auth = this.state.auth;

      if (auth && Component) {
        return <Component {...this.props} />;
      } else if (!auth && Component) {
        let innerPath;
        const search = Qs.parse(window.location.search);
        if (search.backurl) {
          innerPath = search.backurl;
        } else {
          innerPath = '/inner';
        }
        return <Redirect to={innerPath} />;
      }

      return null;
    }
  }

  return RouteHookLogin;
}

const RouteHookAuth = (underAuthComponent) => {
  class RouteHookAuth extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
        auth: false,
      };
    }

    async componentDidMount() {
      await this.checkAuth();

      underAuthComponent.displayName = 'RouteHookAuthDom';

      this.setState({
        component: underAuthComponent,
      });
    }

    async checkAuth() {
      if (RoutePathname !== window.location.pathname) {
        RoutePathname = window.location.pathname;
        const token = localStorage.getItem(`${C.Storage}token`);
        if (!token) {
          this.noAuth('请重新登陆');
          return;
        }

        try {
          await Request('/inner/auth/check');
        } catch (err) {
          console.log(err);
          this.noAuth(err);
          return;
        }
      }

      this.setState({
        auth: true,
      });
    }

    noAuth(err) {
      localStorage.removeItem(`${C.Storage}token`);

      Message({
        type: 'error',
        message: `编号：2001，${err.message || err}`,
        duration: 2000,
      })
    }

    render() {
      const Component = this.state.component;
      const auth = this.state.auth;

      if (auth && Component) {
        return <Component {...this.props} />;
      } else if (!auth && Component) {
        const loginPath = {
          pathname: '/login',
          search: `?backurl=${encodeURIComponent(window.location.pathname)}`,
        };
        return <Redirect to={loginPath} />;
      }

      return null;
    }
  }

  return RouteHookAuth;
}

export {
  RouteHookLogin,
  RouteHookAuth,
};
