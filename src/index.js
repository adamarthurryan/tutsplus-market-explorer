import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from "react-router-dom";

import * as Redux from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import './index.css';
import App from './App';

import * as serviceWorker from './serviceWorker';
import * as reducers from './reducers'
import * as localStore from './util/localStore'

//create the redux store
//initial state is retrieved from localStore
const store = Redux.createStore(
  Redux.combineReducers(reducers), 
  localStore.get(),
  Redux.applyMiddleware(
  	thunkMiddleware,
  //	window.devToolsExtension ? window.devToolsExtension() : undefined,
  )
)


//save the state whenever the state changes
function saveState() {
  let state = store.getState()
  localStore.set(state, ['view', 'query'])
}
store.subscribe(saveState)


ReactDOM.render(
  <BrowserRouter>
	  <Provider store={store}>
			<App/>
	  </Provider>
  </BrowserRouter>
  , document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
