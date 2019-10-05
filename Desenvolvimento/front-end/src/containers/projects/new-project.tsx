import * as React from 'react';
import { Form, FormGroup, Button, Header, Segment, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import ProjectsStore from './store';
import ReactDatePicker from "react-datepicker";
import { getDate } from '../../util';
import { getUser } from '../../util/auth.util';

interface Props {
  projects: ProjectsStore
}

@observer
export default class NewProject extends React.Component<Props>{

    handleSubmit = async (e: any) => {
        e.preventDefault();
        const { handleSubmit } = this.props.projects;
        const id_empresa = getUser().id_pessoa;
        handleSubmit(id_empresa);
    }

    render() {
        const {
            toggleScreen,
            handleChangeNew,
            handleDateNew,
            newProject,
            isLoading
        } = this.props.projects
        return (
            <>
                <Header as="h2">
                    Projetos
                </Header>
                <Segment>
                    <Header as='h2'>
                        Novo
                    </Header>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup widths='equal'>
                            <Form.Field>
                                <Form.Input
                                    fluid
                                    id="nome"
                                    label='Nome do Projeto'
                                    value={newProject.nome}
                                    onChange={handleChangeNew}/>
                            </Form.Field>

                            <Form.Field>
                                <label>Data Limite</label>
                                <ReactDatePicker
                                    id="data_limite"
                                    selected={getDate(newProject.data_limite)}
                                    isClearable
                                    value={newProject.data_limite}
                                    dateFormat='dd/MM/yyyy'
                                    onChange={(date: any) => handleDateNew(date, 'data_limite')}
                                    showYearDropdown
                                    showMonthDropdown/>
                            </Form.Field>

                            <Form.Field>
                                <Form.Input
                                    fluid
                                    id="palavras_chave" 
                                    label='Palavras Chave'
                                    value={newProject.palavras_chave}
                                    onChange={handleChangeNew}/>
                            </Form.Field>
                            
                            <Form.Field>
                                <Form.Input
                                    id="area_projeto" 
                                    label='Área do Projeto'
                                    value={newProject.area_projeto}
                                    onChange={handleChangeNew}/>
                            </Form.Field>
                        </FormGroup>

                        <FormGroup widths="equal">
                            <Form.Field>
                                <Form.TextArea
                                    id="descricao" 
                                    label='Descrição'
                                    value={newProject.descricao}
                                    onChange={handleChangeNew}/>
                            </Form.Field>
                        </FormGroup>

                        <Form.Group style={{ flexDirection: 'row-reverse' }}>
                            <Form.Field>
                                <Button positive type='submit' loading={isLoading} onClick={this.handleSubmit}>
                                    <Icon name='check' />
                                    Salvar
                                </Button>
                            </Form.Field>
                            <Button basic onClick={toggleScreen}>
                                <Icon name='arrow left' />
                                Voltar
                            </Button>
                        </Form.Group>
                    </Form>
                </Segment>
            </>
        )
    }
}