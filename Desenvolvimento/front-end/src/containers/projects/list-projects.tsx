import * as React from 'react';
import { Header, Segment, Form, FormGroup, Button, Grid, Table, Loader, Dimmer } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import ReactDatePicker from "react-datepicker";
import ProjectsStore from './store';
import { getDate } from '../../util';
import { getUser, TipoPessoa } from '../../util/auth.util';

interface Props {
  projects: ProjectsStore
}

@observer
export default class ListProjects extends React.Component<Props> {
  
  componentDidMount() {
    const {
      getProjects
    } = this.props.projects
    
    const isCompany = getUser().tipo_pessoa === TipoPessoa.Company;
    if (isCompany) {
      getProjects(getUser().id_pessoa)
    } else {
      getProjects()
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
      handleSubmitFilter,
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
              <Grid.Column width="8">
                {
                  isCompany ? (
                      <Button
                        title="Novo"
                        type='submit'
                        floated='right'
                        color='green'
                        size='medium'
                        onClick={toggleScreen}>
                        Novo
                      </Button>
                    ) : (
                      <></>
                    )
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Form>
            <FormGroup widths='equal'>
              <Form.Field>
                <Form.Input
                  id="nome_projeto" 
                  label='Nome projeto'
                  value={filter.nome_projeto}
                  onChange={handleChangeFilter}/>
              </Form.Field>

              <Form.Field>
                <Form.Input
                  id="nome_empresa" 
                  label='Nome empresa'
                  value={filter.nome_empresa}
                  onChange={handleChangeFilter}/>
              </Form.Field>
              
              <Form.Field>
                <Form.Input
                  id="palavras_chave" 
                  label='Palavras chave'
                  value={filter.palavras_chave}
                  onChange={handleChangeFilter}/>
              </Form.Field>
            </FormGroup>
            
            <FormGroup widths="equal">
              <Form.Field width="8">
                <Form.Input
                  id="area_projeto" 
                  label='Area projeto'
                  value={filter.area_projeto}
                  onChange={handleChangeFilter}/>
              </Form.Field>

              <Form.Field width="3">
                <label>Data Limite</label>
                <ReactDatePicker
                  id="data"
                  selected={getDate(filter.data)}
                  isClearable
                  value={filter.data}
                  dateFormat='dd/MM/yyyy'
                  onChange={(date: any) => handleDateFilter(date, 'data')}
                  showYearDropdown
                  showMonthDropdown/>
              </Form.Field>
              
            </FormGroup>

            <Form.Group className='row-reverse'>
              <Form.Field className='no-label' width="3">
                <Button
                  title="Pesquisar"
                  type='submit'
                  floated='right'
                  fluid
                  color='blue'
                  onClick={handleSubmitFilter}
                  size='medium'>
                  Filtrar
                </Button>
              </Form.Field>
            </Form.Group>
          </Form>
        </Segment>

        <Segment>
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>#</Table.HeaderCell>
                <Table.HeaderCell>Projeto</Table.HeaderCell>
                <Table.HeaderCell>Empresa</Table.HeaderCell>
                <Table.HeaderCell>Area</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this._renderRows()}
            </Table.Body>
          </Table>
        </Segment>
      </>
    );

  }
}
