import * as React from 'react';
import { Menu, Dropdown, Image } from 'semantic-ui-react';
import MenuStore from '../main-menu/store';
import { inject, observer } from 'mobx-react';
import NewRouterStore from '../../mobx/router.store';
import { logOff, getUserName } from '../../util/auth.util';
import user from '../../images/user.png';

interface Props {
  mainMenu?: MenuStore;
  router?: NewRouterStore;
}

@inject('mainMenu', 'router')
@observer
export default class HeaderMenu extends React.Component<Props> {

    logout = () => {
        const { setHistory } = this.props.router!;
        logOff();
        return setHistory('home');
    }

    render() {

        return (
            <Menu style={{ height: 50, paddingLeft: 200, marginBottom: 0 }}>
                <Menu.Menu position='right'>
                    <Dropdown text={getUserName()} pointing className='link item'>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.logout}>Sair</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Image src={user} avatar style={{ margin: 'auto', marginRight: 20 }}/>
                </Menu.Menu>
            </Menu>
        );
    }
}