import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import * as store from './mobx';
import Routes from './routes';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { router } from './mobx/';
import { Router } from 'react-router-dom';
import { syncHistoryWithStore } from 'mobx-react-router';
import Loading from './components/loading';
import { ToastContainer } from 'react-toastify';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById('root');
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, router);

ReactDOM.render(
  <Provider {...store}>
    <>
      <Loading />
      <Router history={history}>
        <Routes />
      </Router>
      <ToastContainer />
    </>
  </Provider>,
  rootElement
);
serviceWorker.register();