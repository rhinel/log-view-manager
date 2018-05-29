import React from 'react';
import ReactDOM from 'react-dom';
import 'element-theme-default';
import './index.scss';

import Router from './router';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();
