import React, { Component } from 'react';

export default function routeHookAuth(importComponent) {
  class routeHookAuth extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      console.log('routeHookAuth start');
      console.log(new Date());

      // 此处为token校验
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      console.log('routeHookAuth end');
      console.log(new Date());

      console.log('routeHookAuth render');

      this.setState({
        component: importComponent,
      });
    }

    render() {
      const Component = this.state.component;

      return Component ? <Component {...this.props} /> : null;
    }
  }

  return routeHookAuth;
}
