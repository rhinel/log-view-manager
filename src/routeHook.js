import React, { Component } from 'react';

export default function RouteHookAuth(importComponent) {
  class RouteHookAuth extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      console.log('RouteHookAuth Start');
      console.log(new Date());

      // 此处为token校验
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      console.log('RouteHookAuth End');
      console.log(new Date());

      console.log('RouteHookAuth Render');

      importComponent.displayName = 'RouteHookAuthDom';

      this.setState({
        component: importComponent,
      });
    }

    render() {
      const Component = this.state.component;

      return Component ? <Component {...this.props} /> : null;
    }
  }

  return RouteHookAuth;
}
