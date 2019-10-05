import * as React from 'react';
import { Header, Segment, Form, FormGroup, Button, Grid, Table, Loader, Dimmer, Menu, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import ReactDatePicker from "react-datepicker";
import ProjectsStore from './store';
import { getDate } from '../../util';
import { getUser, TipoPessoa } from '../../util/auth.util';
import NewRouterStore from '../../mobx/router.store';

interface Props {
  router: NewRouterStore,
  projects: ProjectsStore
}

@observer
export default class ListProjects extends React.Component<Props> {

  update = (id: number) => {
    const { setHistory } = this.props.router;
    setHistory(`projects/${id}`);
  };

  componentDidMount() {
    const {
      getProjects
    } = this.props.projects

    const isCompany = getUser().tipo_pessoa === TipoPessoa.Company;
    if (isCompany) {
      getProjects(getUser().id_pessoa);
    } else {
      getProjects();
    }
  }

  _handleSubmitFilter = () => {
    const {
      handleSubmitFilter
    } = this.props.projects

    const isCompany = getUser().tipo_pessoa === TipoPessoa.Company;
    if (isCompany) {
      handleSubmitFilter(getUser().id_pessoa)
    } else {
      handleSubmitFilter()
    }
  }

  _renderRows = () => {
    const {
      records,
      isLoading
    } = this.props.projects

    if (!isLoading) {
      return (
        records.map((r) => (
          <Table.Row key={r.id}>
            <Table.Cell>{r.id}</Table.Cell>
            <Table.Cell>{r.nome}</Table.Cell>
            <Table.Cell>{r.empresa.nome}</Table.Cell>
            <Table.Cell>{r.area_projeto}</Table.Cell>
            <Table.Cell>{r.data_limite}</Table.Cell>
            <Table.Cell textAlign='center'>
              <Button
                title="Visualizar"
                type='submit'
                floated='right'
                color='blue'
                size='medium'
                onClick={() => this.update(r.id)}>
                  <Icon name='file text outline' />
                  Visualizar
              </Button>              
            </Table.Cell>
          </Table.Row>
        ))
      )
    } else {
      return (
        <Dimmer.Dimmable as={Table.Row} dimmed={false}>
          <Table.Cell>
            <Dimmer active inverted>
              <Loader indeterminate inline='centered' inverted>Carregando dados</Loader>
            </Dimmer>
          </Table.Cell>
        </Dimmer.Dimmable>
      )
    }
  }

  render() {
    const {
      toggleScreen,
      handleChangeFilter,
      handleDateFilter,
      filter
    } = this.props.projects

    const isCompany = getUser().tipo_pessoa === TipoPessoa.Company;

    return (
      <>
        <Header as='h2'>
          Projetos
        </Header>
        <Segment>
          <Grid style={{ marginBottom: 5 }}>
            <Grid.Row style={{ justifyContent: 'space-between' }}>
              <Grid.Column width="8">
                <Header as='h2'>
                  Filtro
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Form>
            <FormGroup widths='equal'>
              <Form.Field>
                <Form.Input
                  id="nome_projeto"
                  label='Nome do Projeto'
                  value={filter.nome_projeto}
                  onChange={handleChangeFilter} />
              </Form.Field>

              <Form.Field>
                <label>Data Limite</label>
                <ReactDatePicker
                  id="data"
                  selected={getDate(filter.data_limite)}
                  isClearable
                  value={filter.data_limite}
                  dateFormat='dd/MM/yyyy'
                  onChange={(date: any) => handleDateFilter(date, 'data_limite')}
                  showYearDropdown
                  showMonthDropdown />
              </Form.Field>

              <Form.Field>
                <Form.Input
                  id="area_projeto"
                  label='Área do Projeto'
                  value={filter.area_projeto}
                  onChange={handleChangeFilter} />
              </Form.Field>
            </FormGroup>

            <FormGroup widths="equal">
              <Form.Field>
                <Form.Input
                  id="nome_empresa"
                  label='Nome da Empresa'
                  value={filter.nome_empresa}
                  onChange={handleChangeFilter} />
              </Form.Field>

              <Form.Field>
                <Form.Input
                  id="palavras_chave"
                  label='Palavras Chave'
                  value={filter.palavras_chave}
                  onChange={handleChangeFilter} />
              </Form.Field>
            </FormGroup>

            <Form.Group className='row-reverse' style={{ marginTop: 30, marginBottom: 30 }}>
              <Form.Field className='no-label' width="2">
                <Button
                  title="Filtrar"
                  type='submit'
                  floated='right'                  
                  fluid
                  primary
                  onClick={this._handleSubmitFilter}
                  size='medium'>
                    <Icon name='search' />
                    Filtrar
                  </Button>

              </Form.Field>
              {
                isCompany ? (
                  <Button
                    title="Novo Projeto"
                    type='submit'
                    floated='right'
                    color='green'
                    size='medium'
                    onClick={toggleScreen}>
                      <Icon name='add' />
                      Novo Projeto
                  </Button>
                ) : (
                  <></>
                )
              }
            </Form.Group>
          </Form>

          <Table selectable striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>NOME</Table.HeaderCell>
                <Table.HeaderCell>EMPRESA</Table.HeaderCell>
                <Table.HeaderCell>ÁREA</Table.HeaderCell>
                <Table.HeaderCell>DATA LIMITE</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this._renderRows()}
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='6'>
                  <Menu floated='right' pagination>
                    <Menu.Item as='a' icon>
                      <Icon name='chevron left' />
                    </Menu.Item>
                    <Menu.Item as='a' active>1</Menu.Item>
                    <Menu.Item as='a' icon>
                      <Icon name='chevron right' />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Segment>
      </>
    );

  }
}
