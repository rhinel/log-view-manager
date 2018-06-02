import React, { Component } from 'react';
import { Breadcrumb } from 'element-react';

import './setting.scss';

class Setting extends Component {

  render() {
    return (
      <div className="inner setting">
        <div className="breadcrumb">
          <Breadcrumb separator="/">
            <Breadcrumb.Item>系统设置</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
    )
  }

}

export default Setting;
