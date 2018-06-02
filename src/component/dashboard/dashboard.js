import React, { Component } from 'react';
import { Breadcrumb, Button } from 'element-react';

import './dashboard.scss';

class Dashboard extends Component {

  render() {
    return (
      <div className="inner dashboard">
        <div className="breadcrumb">
          <Breadcrumb separator="/">
            <Breadcrumb.Item>主控面板</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="top-btns-bar">
          <Button
            type="primary"
            size="small">新增日志目录</Button>
        </div>
      </div>
    )
  }

}

export default Dashboard;
