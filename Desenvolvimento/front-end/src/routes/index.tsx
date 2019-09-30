import * as React from 'react';
import { observer } from 'mobx-react';
import {
  Route,
  Switch,
  withRouter,
  Redirect,
} from 'react-router-dom';
import NotFound from '../containers/not-found';
import MainMenu from '../components/main-menu';
import HeaderMenu from '../components/header-menu';
import PrivateRoutes from './private-routes';
import Login from '../containers/login';
import { isLoggedIn } from '../util/auth.util';

// @ts-ignore
@withRouter
@observer
export default class Routes extends React.Component {

  render() {
    const publicUrl = process.env.PUBLIC_URL;

    return (
      <Switch>
        <Route  path={`${publicUrl}/login`} component={Login}/>
        {isLoggedIn() ?
          <>
            <div>
              <HeaderMenu />
              <MainMenu />
              <div style={{ paddingLeft: 200, position: 'fixed', height: 'calc(100vh - 50px)', width: '100%', background: '#f0f0f7', overflowX: 'auto' }}>
                <div style={{ position: 'relative' }}>
                  <PrivateRoutes />
                </div>
              </div>
            </div>
          </>
          : 
          <Redirect to={{ pathname: `${publicUrl}/login` }}/>
        }
        <Route render={props => <NotFound {...props} />} />
      </Switch>
    );
  }
}