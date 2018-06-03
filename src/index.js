import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Create a store and pass it our reducer function
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
// More powerful to use Redux devtools instead of regular console log
// console.log(store.getState());

ReactDOM.render(
  // <App store={store} />, 
  // By letting Provider (locatd on the React-Redux bindings) take care of business
  // and by passing store to Provider...
  // and then wrapping our main root component (<App /> in this case) inside of Provider, 
  // whenever any of the components that App renders, or whenever App itself needs access to Redux store or needs to dispatch an action...
  // ...it can more easily do that
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();