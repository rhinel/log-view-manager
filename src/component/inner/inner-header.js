import React, { Component } from 'react';
import { withRouter as WithRouter } from 'react-router-dom';
import { Menu } from 'element-react';

import './inner-header.scss';

class InnerHeader extends Component {
  onSelect(path) {
    if (this.props.location.pathname === path) return;
    this.props.history
      .push(path);
  }

  checkSelect(path) {
    const { pathname } = this.props.location
    if (
      pathname === '/inner'
        && path === '/inner/dashboard'
    ) return true;

    return pathname !== '/inner'
      && pathname.includes(path);
  }

  render() {
    return (
      <div className="inner-header">
        <Menu
          theme="dark"
          mode="horizontal"
          onSelect={this.onSelect.bind(this)}>

          <Menu.Item
            index="/inner/dashboard"
            className={this.checkSelect('/inner/dashboard') ? 'is-active' : ''}
          >主控面板</Menu.Item>

          <Menu.Item
            index="/inner/setting"
            className={this.checkSelect('/inner/setting') ? 'is-active' : ''}
          >系统设置</Menu.Item>

        </Menu>
      </div>
    )
  }
}

export default WithRouter(InnerHeader);
