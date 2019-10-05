import * as React from 'react';
import MenuStore from '../../components/main-menu/store';
import { Container, Card, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NewRouterStore from '../../mobx/router.store';
import HomeStore from './store';

interface Props {
  mainMenu: MenuStore;
  router: NewRouterStore;
  home: HomeStore;
}

@inject('mainMenu', 'router', 'home')
@observer
export default class Home extends React.Component<Props> {

  componentDidMount = () => {
    const { setRoutes } = this.props.mainMenu;
    setRoutes();
  }

  redirect = (url: string) => {
    const { setMenuActive } = this.props.mainMenu;
    setMenuActive(url);

    const { history } = this.props.router;
    history.push(`${process.env.PUBLIC_URL}/${url}`);
  };

  render() {
    const { routes } = this.props.mainMenu;

    return (
      <Container style={{ padding: 20 }}>
        <Header color='blue'>
          <Header.Content>
            <h2>
              O que deseja acessar?
            </h2>
          </Header.Content>
        </Header>
        <Card.Group itemsPerRow={2}>
          {routes.map(e => <Card id={e.route} fluid key={e.route} color={e.color} header={e.title} description={e.description} onClick={() => { this.redirect(e.route); }} />)}
        </Card.Group>
      </Container>
    );

  }
}
