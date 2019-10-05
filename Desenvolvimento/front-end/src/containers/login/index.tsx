import * as React from 'react';
import { Form, Button, GridRow, GridColumn, Grid, Checkbox } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import LoginStore from './store';
import './index.css'
import image from '../../images/fundo.png';
import MainMenuStore from '../../components/main-menu/store';
import NewRouterStore from '../../mobx/router.store';

interface Props {
  mainMenu: MainMenuStore;
  router: NewRouterStore;
  login: LoginStore;
}

@inject('mainMenu', 'router', 'login')
@observer
export default class Login extends React.Component<Props> {

  redirect = () => {
    const path = 'home';
    const { setMenuActive } = this.props.mainMenu;
    setMenuActive(path);
    const { setHistory } = this.props.router;
    setHistory(path);
  };

  handleSubmit = async (event: any) => {
    event.preventDefault();
    const { handleSubmit } = this.props.login;
    try {
      await handleSubmit();
      this.redirect();
    } catch (err) {
      console.log('Ops, verifique o login');
    }
  }

  handleRegister = async (event: any) => {
    event.preventDefault();
    const path = 'choose-register-type';
    const { setHistory } = this.props.router;
    setHistory(path);
  }

  render() {
    const {
      handleChange,
      isLoading,
      password,
      user_name
    } = this.props.login
    return (
      <section className={'login-register login-sidebar'} style={{ backgroundImage: `url(${image})` }}>
        <div className={'login-box card'}>
          <div className={'card-body'}>
            <div className={'title'}>
              <h1>PROJETCTS</h1>
              <h3>Bem vindo! Por favor, faça o login.</h3>
            </div>
            <Form>
              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                id="user_name"
                placeholder='Usuário'
                value={user_name}
                onChange={handleChange} />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                id="password"
                type='password'
                placeholder='Password'
                value={password}
                onChange={handleChange} />

              <Grid className={'infos'}>
                <GridRow columns={2}>
                  <GridColumn>
                    <Checkbox label='Lembrar-me' />
                  </GridColumn>
                  <GridColumn className={'forget-password'}>
                    <span>Esqueci a senha</span>
                  </GridColumn>
                </GridRow>
              </Grid>

              <Grid>
                <GridRow columns={2}>
                  <GridColumn>
                    <Button color='blue' fluid size='large' loading={isLoading} onClick={this.handleSubmit}>
                      Entrar
                  </Button>
                  </GridColumn>
                  <GridColumn>
                    <Button basic color='blue' fluid size='large' onClick={this.handleRegister}>
                      Cadastrar-se
                    </Button>
                  </GridColumn>
                </GridRow>
              </Grid>

            </Form>
          </div>
        </div>
      </section>
    );

  }
}
