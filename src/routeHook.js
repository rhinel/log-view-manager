import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Message, Loading } from 'element-react';
import Qs from 'query-string';
/* eslint-disable import/no-unresolved */
import C from '@/common/config';
import Request from '@/common/request';

let RoutePathname = '';

const RouteHookLogin = (loginComponent) => {
  class RouteHookLoginClass extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
        auth: false,
      };
    }

    async componentDidMount() {
      // console.log('login', RoutePathname, this.props.location.pathname);
      await this.checkAuth();

      loginComponent.displayName = 'RouteHookAuthLogin';

      this.setState({
        component: loginComponent,
      });
    }

    async checkAuth() {
      // 如果是相同地址，则不给权限
      if (RoutePathname === this.props.location.pathname) {
        return;
      }

      RoutePathname = this.props.location.pathname;

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
      const RenderComponent = this.state.component;
      const { auth } = this.state;

      if (!auth && RenderComponent) {
        return <RenderComponent {...this.props} />;
      }

      if (auth && RenderComponent) {
        let innerPath;
        const search = Qs.parse(this.props.location.search);
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

  return RouteHookLoginClass;
}

const RouteHookAuth = (underAuthComponent) => {
  class RouteHookAuthClass extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
        auth: false,
      };
    }

    async componentDidMount() {
      // console.log('auth', RoutePathname, this.props.location.pathname);
      await this.checkAuth();

      underAuthComponent.displayName = 'RouteHookAuthDom';

      this.setState({
        component: underAuthComponent,
      });
    }

    async checkAuth() {
      // 如果地址不相同，进入校验，否则直接给权限
      if (RoutePathname !== this.props.location.pathname) {
        RoutePathname = this.props.location.pathname;

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
      const RenderComponent = this.state.component;
      const { auth } = this.state;

      if (auth && RenderComponent) {
        return <RenderComponent {...this.props} />;
      }

      if (!auth && RenderComponent) {
        const loginPath = {
          pathname: '/login',
          search: `?backurl=${encodeURIComponent(
            window.location.hash.replace('#', ''),
          )}`,
        };
        return <Redirect to={loginPath} />;
      }

      return <Loading fullscreen={true} />;
    }
  }

  return RouteHookAuthClass;
}

export {
  RouteHookLogin,
  RouteHookAuth,
};
