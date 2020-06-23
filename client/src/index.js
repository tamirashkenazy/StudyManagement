import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from 'react-redux'
import configureStore from './components/redux/store'
const store = configureStore()

// the "root" is from the index.html id=root
ReactDOM.render(
//store is related to redux 
<Provider store={store}>
    <App />
</Provider>, 
document.getElementById('root'));


