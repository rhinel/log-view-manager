import React from 'react';
import ReactDOM from 'react-dom';
/* eslint-disable import/no-unresolved */
import 'element-theme-default';
import '@/index.scss';

import { Root } from '@/router';

import registerServiceWorker from '@/registerServiceWorker';

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
