import * as React from 'react';
import MenuStore from './store';
import { Menu, Sidebar, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NewRouterStore from '../../mobx/router.store';

interface Props {
  mainMenu?: MenuStore;
  router?: NewRouterStore;
}

@inject('mainMenu', 'router')
@observer
export default class MainMenu extends React.Component<Props> {

  componentDidMount = () => {
    const main = this.props.mainMenu;
    if (main) {
      main.setRoutes();
    }
  }

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
                <Icon name='home'/>
                Início
            </Menu.Item>

            <Menu.Item
              id='my-projects-menu'
              name='my-projects'
              active={activated === 'my-projects'}
              url='my-projects'
              className={'text-white'}
              onClick={this.handleItemClick}>
                <Icon name='clipboard'/>
                Meus Projetos
            </Menu.Item>

            <Menu.Item
              id='projects-menu'
              name='projects'
              active={activated === 'projects'}
              url='projects'
              className={'text-white'}
              onClick={this.handleItemClick}>
                <Icon name='sticky note'/>
                Projetos
            </Menu.Item>

            <Menu.Item
              id='companies-menu'
              name='companies'
              active={activated === 'companies'}
              url='companies'
              className={'text-white'}
              onClick={this.handleItemClick}>
                <Icon name='globe'/>
                Empresas
            </Menu.Item>

            {/* <Menu.Item
              id='my-projects-menu'
              name='my_projects'
              active={activated === 'my_projects'}
              url='my_projects'
              className={'text-white'}
              onClick={this.handleItemClick}>
                <Icon name='wechat'/>
                Conversas
            </Menu.Item>

            <Menu.Item
              id='my-projects-menu'
              name='my_projects'
              active={activated === 'my_projects'}
              url='my_projects'
              className={'text-white'}
              onClick={this.handleItemClick}>
                <Icon name='calendar alternate outline'/>
                Calendário
            </Menu.Item> */}

            <Menu.Item
              id='help-menu'
              name='help'
              active={activated === 'help'}
              url='help'
              className={'text-white'}
              onClick={this.handleItemClick}>
                <Icon name='life ring outline'/>
                Ajuda
            </Menu.Item>

            <Menu.Item
              id='settings-menu'
              name='settings'
              active={activated === 'settings'}
              url='settings'
              className={'text-white'}
              onClick={this.handleItemClick}>
                <Icon name='setting'/>
                Configuração
            </Menu.Item>
        </Sidebar>
      </>
    );
  }
}