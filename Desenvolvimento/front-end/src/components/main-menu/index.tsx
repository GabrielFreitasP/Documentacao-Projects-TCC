import * as React from 'react';
import MenuStore from './store';
import { Menu, Sidebar } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NewRouterStore from '../../mobx/router.store';

interface Props {
  mainMenu?: MenuStore;
  router?: NewRouterStore;
}

@inject('mainMenu', 'router')
@observer
export default class MainMenu extends React.Component<Props> {

  handleItemClick = (_: any, { name, url }: any) => {

    const { setMenuActive } = this.props.mainMenu!;

    setMenuActive(name);

    const { setHistory } = this.props.router!;

    return setHistory(url);
  };

  logout = () => {

    const { setHistory } = this.props.router!;

    return setHistory('home');

  }

  render() {

    const { activated } = this.props.mainMenu!;

    return (
      <>
        <Sidebar
          as={Menu}
          vertical
          visible={true}
          className={'sidemenu-app text-white'}
          width="thin">
            <Menu.Header>
              <div style={{ fontWeight: "bold", fontSize: 20, textAlign: "center", padding: 15}}>
                Projects
              </div>
            </Menu.Header>

            <Menu.Item
              id='home-menu'
              name='home'
              active={activated === 'home'}
              url='home'
              className={'text-white'}
              onClick={this.handleItemClick}>
              Home
            </Menu.Item>

            <Menu.Item
              id='projects-menu'
              name='projects'
              active={activated === 'projects'}
              url='projects'
              className={'text-white'}
              onClick={this.handleItemClick}>
              Projetos
            </Menu.Item>
        </Sidebar>
      </>
    );
  }
}