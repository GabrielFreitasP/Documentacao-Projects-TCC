import * as React from 'react';
import { Form, Button, Grid, GridRow, GridColumn, Checkbox } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import RegisterStore from './store';
import './index.css'
import image from '../../images/fundo.png';
import MainMenuStore from '../../components/main-menu/store';
import NewRouterStore from '../../mobx/router.store';
import { RouteComponentProps } from 'react-router';

interface Props {
  mainMenu: MainMenuStore;
  router: NewRouterStore;
  register: RegisterStore
}

@inject('mainMenu', 'router', 'register')
@observer
export default class Register extends React.Component<RouteComponentProps<{ personType: string }> & Props> {

  componentDidMount = () => {
    const { handleTypePerson, handleClear } = this.props.register;
    handleClear();

    const typePerson: number = this.props.match.params.personType === 'company' ? 0 : 1;    
    handleTypePerson(typePerson);
  }

  redirect = () => {
    const path = 'login';
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
    const path = 'choose-register-type';
    const { setHistory } = this.props.router;
    setHistory(path);
  }

  handleBackLogin = async (event: any) => {
    event.preventDefault();
    const path = 'login';
    const { setHistory } = this.props.router;
    setHistory(path);
  }

  render() {
    const {
      handleChange,
      isLoading,
      user,
      confirmPassword
    } = this.props.register

    const isCompany: boolean = user.person.tipo_pessoa === 0;

    return (
      <section className={'login-register login-sidebar'} style={{ backgroundImage: `url(${image})` }}>
        <div className={'login-box card'} style={{ overflow: 'auto' }}>
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
                      id="user.person.nome"
                      placeholder={isCompany ? 'Razão Social' : 'Primeiro Nome'}
                      value={user.person.nome}
                      onChange={handleChange} />
                  </GridColumn>

                  <GridColumn>
                    <Form.Input
                      required
                      fluid
                      icon='user'
                      iconPosition='left'
                      id="user.person.apelido"
                      placeholder={isCompany ? 'Nome Fantasia' : 'Sobrenome'}                      
                      value={user.person.apelido}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={1}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='mail'
                      iconPosition='left'
                      id="user.person.email"
                      placeholder='E-mail'
                      value={user.person.email}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={1}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='phone'
                      iconPosition='left'
                      id="user.person.telefone"
                      placeholder='Celular'
                      value={user.person.telefone}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={1}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='facebook'
                      iconPosition='left'
                      id="user.person.facebook"
                      placeholder='Facebook'
                      value={user.person.facebook}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={1}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='user'
                      iconPosition='left'
                      id="user.user_name"
                      placeholder='Usuário'
                      value={user.user_name}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>

                <GridRow columns={2}>
                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='key'
                      iconPosition='left'
                      id="user.password"
                      placeholder='Senha'
                      type='password'
                      value={user.password}
                      onChange={handleChange} />
                  </GridColumn>

                  <GridColumn>
                    <Form.Input
                      fluid
                      icon='key'
                      iconPosition='left'
                      id="confirmPassword"
                      type='password'
                      placeholder='Confirmar Senha'
                      value={confirmPassword}
                      onChange={handleChange} />
                  </GridColumn>
                </GridRow>
              </Grid>
            </Form>

            <Grid>
              <GridRow columns={1}>
                <GridColumn>
                  <Checkbox label='Concordo com os termos em condição' />
                </GridColumn>
              </GridRow>

              <GridRow style={{ justifyContent: 'center' }} >
                  <Button basic size='large' loading={isLoading} onClick={this.handleBack}>
                    Voltar
                  </Button>
                  <Button color='blue' size='large' loading={isLoading} onClick={this.handleSubmit}>
                    Cadastrar
                  </Button>
              </GridRow>

              <GridRow style={{ justifyContent: 'center' }}>
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={this.handleBackLogin}>
                  Já possui uma conta? Entre.
                    </span>
              </GridRow>
            </Grid>
          </div>
        </div>
      </section>
    );
  }
}
