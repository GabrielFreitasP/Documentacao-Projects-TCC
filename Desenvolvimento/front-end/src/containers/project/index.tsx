import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Container, Header, Segment, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import ProjectStore from './store';
import ReactDatePicker from "react-datepicker";
import { getDate } from '../../util';

interface Props {
  project: ProjectStore
}

@inject('project')
@observer
export default class Project extends React.Component<RouteComponentProps<{ id: string }> & Props> {
  
  render() {
    const {
      project,
      handleDate,
      handleChange
    } = this.props.project
    // const id = Number(this.props.match.params.id);

    return (
        <Container style={{ padding: 20 }}>
          <Header as="h2">
              Projeto
          </Header>
          <Segment>
              <Form>
                  <Form.Group widths='equal'>
                      <Form.Field>
                          <Form.Input
                              fluid
                              id="nome"
                              label='Nome projeto'
                              value={project.nome}
                              onChange={handleChange}/>
                      </Form.Field>

                      <Form.Field>
                          <label>Data Limite</label>
                          <ReactDatePicker
                              id="data_limite"
                              selected={getDate(project.data_limite)}
                              isClearable
                              value={project.data_limite}
                              dateFormat='dd/MM/yyyy'
                              onChange={(date: any) => handleDate(date, 'data_limite')}
                              showYearDropdown
                              showMonthDropdown/>
                      </Form.Field>

                      <Form.Field>
                          <Form.Input
                              fluid
                              id="palavras_chaves" 
                              label='Palavras chave'
                              value={project.palavras_chaves}
                              onChange={handleChange}/>
                      </Form.Field>
                      
                      <Form.Field>
                          <Form.Input
                              id="area_projeto" 
                              label='Area projeto'
                              value={project.area_projeto}
                              onChange={handleChange}/>
                      </Form.Field>
                  </Form.Group>

                  <Form.Group widths="equal">
                      <Form.Field>
                          <Form.TextArea
                              id="descricao" 
                              label='Descriçao'
                              value={project.descricao}
                              onChange={handleChange}/>
                      </Form.Field>
                  </Form.Group>

                  {/* <Form.Group style={{ flexDirection: 'row-reverse' }}>
                      <Form.Field>
                          <Button.Group>
                              <Button positive type='submit' loading={isLoading} onClick={this.handleSubmit}>Salvar</Button>
                          </Button.Group>
                      </Form.Field>
                  </Form.Group> */}
              </Form>
          </Segment>
        </Container>
    );
  }
}
