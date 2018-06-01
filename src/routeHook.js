import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Message, Loading } from 'element-react';
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
        auth: false,
      };
    }

    async componentDidMount() {
      // console.log('login', RoutePathname, window.location.pathname);
      await this.checkAuth();

      loginComponent.displayName = 'RouteHookAuthLogin';

      this.setState({
        component: loginComponent,
      });
    }

    async checkAuth() {
      // 如果是相同地址，则不给权限
      if (RoutePathname === window.location.pathname) {
        return;
      }

      RoutePathname = window.location.pathname;

      // 如果没有token，则不给权限
      const token = localStorage.getItem(`${C.Storage}token`);
      if (!token) {
        return;
      }

      // token没有权限，则不给权限
      try {
        await Request('/inner/auth/check');
      } catch (err) {
        console.log(err);
        return;
      }

      this.setState({
        auth: true,
      });
    }

    render() {
      const Component = this.state.component;
      const auth = this.state.auth;

      if (!auth && Component) {
        return <Component {...this.props} />;
      } else if (auth && Component) {
        let innerPath;
        const search = Qs.parse(window.location.search);
        if (search.backurl) {
          innerPath = search.backurl;
          RoutePathname = innerPath.split('#')[0].split('?')[0];
        } else {
          innerPath = '/inner';
          RoutePathname = innerPath;
        }
        return <Redirect to={innerPath} />;
      }

      return <Loading fullscreen={true} />;
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
      // console.log('auth', RoutePathname, window.location.pathname);
      await this.checkAuth();

      underAuthComponent.displayName = 'RouteHookAuthDom';

      this.setState({
        component: underAuthComponent,
      });
    }

    async checkAuth() {
      // 如果地址不相同，进入校验，否则直接给权限
      if (RoutePathname !== window.location.pathname) {
        RoutePathname = window.location.pathname;

        // 如果没有token，则不给权限
        const token = localStorage.getItem(`${C.Storage}token`);
        if (!token) {
          this.noAuth('请重新登陆');
          return;
        }

        // token没有权限，则不给权限
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

      return <Loading fullscreen={true} />;
    }
  }

  return RouteHookAuth;
}

export {
  RouteHookLogin,
  RouteHookAuth,
};
