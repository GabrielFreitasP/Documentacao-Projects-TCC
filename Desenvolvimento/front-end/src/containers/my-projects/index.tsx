import * as React from 'react';
import MenuStore from '../../components/main-menu/store';
import { Container, Card, Header, CardContent } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NewRouterStore from '../../mobx/router.store';
import MyProjectsStore from './store';
import { getUser } from '../../util/auth.util';

interface Props {
  mainMenu: MenuStore;
  router: NewRouterStore;
  myProjects: MyProjectsStore;
}

@inject('mainMenu', 'router', 'myProjects')
@observer
export default class MyProjects extends React.Component<Props> {
  
  componentDidMount() {
    const { getMyProjects } = this.props.myProjects;
    const id_pessoa = getUser().id_pessoa;
    getMyProjects(id_pessoa)
  }

  redirect = (id: number) => {
    const path = 'projects'
    const { setMenuActive } = this.props.mainMenu;
    setMenuActive(path);

    const { history } = this.props.router;
    history.push(`${process.env.PUBLIC_URL}/${path}/${id}`);
  };

  render() {
    const { records } = this.props.myProjects;

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
          {records.map(e => 
            <Card fluid color='blue' key={e.id} onClick={() => { this.redirect(e.id); }}>
              <CardContent>
                <Card.Header>{e.nome}</Card.Header>
                <Card.Meta>{e.data_limite}</Card.Meta>
                <Card.Description>
                  {e.descricao}
                </Card.Description>
              </CardContent>

            </Card>
          )}
        </Card.Group>
      </Container>
    );

  }
}
