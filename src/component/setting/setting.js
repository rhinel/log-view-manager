import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './setting.scss';

class Setting extends Component {

  render() {
    return (
      <div className="setting">
        setting<br />
        <Link to="/inner/dashboard">dashboard</Link>
      </div>
    )
  }

}

export default Setting;
