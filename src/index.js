import React from 'react';
import ReactDOM from 'react-dom';
import './styles/App.css';
import App from './App';

import { Provider } from "react-redux";
import Store from "./store";

import registerServiceWorker from './registerServiceWorker';

const StoreInstance = Store();

StoreInstance.subscribe(() => {
    var state = StoreInstance.getState();
    console.log('new state', state);
})

ReactDOM.render(
<Provider store={StoreInstance}>
<App />
</Provider>, document.getElementById('root'));
registerServiceWorker();
