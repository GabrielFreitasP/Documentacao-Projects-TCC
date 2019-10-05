import * as React from 'react';
import MenuStore from '../../components/main-menu/store';
import { Container, Card, Header, CardContent } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NewRouterStore from '../../mobx/router.store';
import MyProjectsStore from './store';

interface Props {
  mainMenu: MenuStore;
  router: NewRouterStore;
  myProjects: MyProjectsStore;
}

@inject('mainMenu', 'router', 'myProjects')
@observer
export default class MyProjects extends React.Component<Props> {
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
              Todos os seus projetos estãos aqui
            </h2>
          </Header.Content>
        </Header>
        <Card.Group itemsPerRow={2}>
          {routes.map(e => 
            <Card fluid color='blue' onClick={() => { this.redirect(e.route); }}>
              <CardContent>
                <Card.Header>Nome do Projeto</Card.Header>
                <Card.Meta>Data Limite</Card.Meta>
                <Card.Description>
                  Descrição
                </Card.Description>
              </CardContent>

            </Card>
          )}
        </Card.Group>
      </Container>
    );

  }
}
