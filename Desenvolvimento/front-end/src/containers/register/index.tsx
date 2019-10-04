import * as React from 'react';
import { Form, Button, Grid, GridRow, GridColumn, Checkbox } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import RegisterStore from './store';
import './index.css'
import image from '../../images/fundo.png';
import MainMenuStore from '../../components/main-menu/store';
import NewRouterStore from '../../mobx/router.store';

interface Props {
  mainMenu: MainMenuStore;
  router: NewRouterStore;
  register: RegisterStore
}

@inject('mainMenu', 'router', 'register')
@observer
export default class Register extends React.Component<Props> {

  redirect = () => {
    const path = 'home';
    const { setMenuActive } = this.props.mainMenu;
    setMenuActive(path);
    const { setHistory } = this.props.router;
    setHistory(path);
  };

  handleSubmit = async (event: any) => {
    event.preventDefault();
    const { handleSubmit } = this.props.register;
    try {
      await handleSubmit();
      this.redirect();
    } catch (err) {
      console.log('Ops, verifique o login');
    }
  }

  handleBack = async (event: any) => {
    event.preventDefault();
    const path = 'login';
    const { setMenuActive } = this.props.mainMenu;
    setMenuActive(path);
    const { setHistory } = this.props.router;
    setHistory(path);
  }

  render() {
    const {
      handleChange,
      isLoading,
      user
    } = this.props.register

    return (
      <section className={'login-register login-sidebar'} style={{ backgroundImage: `url(${image})` }}>
        <div className={'login-box card'} style={{overflow: 'auto'}}>
          <div className={'card-body'}>
            <div className={'title'}>
              <h1>PROJETCTS</h1>
              <h3>Por favor, preencha os campos para se cadastrar</h3>
            </div>
            <Form>
              <Grid>
                <GridRow columns={2}>
                  <GridColumn>
                    <Form.Input
                      required
                      fluid
                      icon='user'
                      iconPosition='left'
                      id="user_name"
                      placeholder='Primeiro Nome'
                      value={user.user_name}
                      onChange={handleChange} />
                  </GridColumn>

                  <GridColumn>
                    <Form.Input
                      required
                      fluid
                      icon='user'
                      iconPosition='left'
                      id="user_name"
                      placeholder='Sobrenome'
                      value={user.user_name}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={1}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='mail'
                      iconPosition='left'
                      id="user_name"
                      placeholder='E-mail'
                      value={user.user_name}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={1}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='phone'
                      iconPosition='left'
                      id="user_name"
                      placeholder='Celular'
                      value={user.user_name}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={1}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='facebook'
                      iconPosition='left'
                      id="person.facebook"
                      placeholder='Facebook'
                      value={user.person.facebook}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={2}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='key'
                      iconPosition='left'
                      id="user_name"
                      placeholder='Senha'
                      value={user.user_name}
                      onChange={handleChange} />
                  </GridColumn>

                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='key'
                      iconPosition='left'
                      id="user_name"
                      placeholder='Confirmar Senha'
                      value={user.user_name}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={1}>
                  <GridColumn>
                    <Checkbox label='Concordo com os termos em condição' />
                  </GridColumn>
                </GridRow>

                <GridRow style={{justifyContent: 'center'}}>
                  <Button color='blue' size='large' loading={isLoading} onClick={this.handleSubmit}>
                    Cadastrar
                  </Button>
                </GridRow>

                <GridRow style={{ justifyContent: 'center'}}>
                    <span style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={this.handleBack}>
                      Já possui uma conta? Entre.
                    </span>                    
                </GridRow>
              </Grid>

            </Form>
          </div>
        </div>
      </section>
    );
  }
}
