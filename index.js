import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/App.js';
import { Provider } from 'react-redux';
import store from './client/store';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
   <Provider store={store}>
      <Router>
         <App />
      </Router>
   </Provider>,
   document.querySelector('#app'),
);
