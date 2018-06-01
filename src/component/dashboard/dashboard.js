import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './dashboard.scss';

class Dashboard extends Component {

  render() {
    return (
      <div className="inner dashboard">
        dashboard<br />
        <Link to="/inner/setting">setting</Link>
      </div>
    )
  }

}

export default Dashboard;
