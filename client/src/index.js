import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from "./components/main/utils/authentication";
import history from "./components/main/utils/history";
import config from "./components/main/utils/auth_config.json";
import { Provider } from 'react-redux'
import configureStore from './components/redux/store'
const store = configureStore()

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
    history.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  };

// the "root" is from the index.html id=root
ReactDOM.render(
//store is related to redux 
<Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
<Provider store={store}>
    <App />
</Provider>
</Auth0Provider>,

document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
