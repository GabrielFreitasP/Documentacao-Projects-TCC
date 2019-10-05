import * as React from 'react';
import { Button, Grid, GridRow, GridColumn } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import './index.css'
import image from '../../images/fundo.png';
import MainMenuStore from '../../components/main-menu/store';
import NewRouterStore from '../../mobx/router.store';
import ChooseRegisterTypeStore from './store';

interface Props {
  mainMenu: MainMenuStore;
  router: NewRouterStore;
  chooseRegisterType: ChooseRegisterTypeStore
}

@inject('mainMenu', 'router', 'chooseRegisterType')
@observer
export default class ChooseRegisterType extends React.Component<Props> {

  selectPerson = (personType: number) => {
    let path = 'register/';
    if (personType === 0) {
      path += 'company'
    } else {
      path += 'developer'
    }
    const { setHistory } = this.props.router;
    setHistory(path);
  }

  handleBack = (event: any) => {
    event.preventDefault();
    const path = 'login';
    const { setHistory } = this.props.router;
    setHistory(path);
  }

  render() {
    return (
      <section className={'login-register login-sidebar'} style={{ backgroundImage: `url(${image})` }}>
        <div className={'login-box card'} style={{overflow: 'auto'}}>
          <div className={'card-body'}>
            <div className={'title'}>
              <h1>PROJETCTS</h1>
              <h3>Por favor, informe se você é empresa ou desenvolvedor</h3>
            </div>
            <Grid>
              <GridRow columns={2}>
                <GridColumn>
                  <Button basic style={{ float: 'right', fontSize: 15, height: 60 }} primary onClick={() => this.selectPerson(0)}>Sou uma Empresa</Button>
                </GridColumn>
                <GridColumn>
                  <Button basic style={{ fontSize: 15, height: 60 }} color='teal' onClick={() => this.selectPerson(1)}>Sou um Desenvolvedor</Button>
                </GridColumn>
              </GridRow>

              <GridRow style={{ justifyContent: 'center', marginTop: '20px'}}>
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={this.handleBack}>
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
