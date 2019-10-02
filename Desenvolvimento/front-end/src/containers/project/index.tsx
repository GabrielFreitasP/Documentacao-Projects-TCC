import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Container, Header, Segment, Form, Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import ProjectStore from './store';
import ReactDatePicker from "react-datepicker";
import { getDate } from '../../util';
import { getUser } from '../../util/auth.util';
import NewRouterStore from '../../mobx/router.store';

interface Props {
    router: NewRouterStore,
    project: ProjectStore
}

@inject('router', 'project')
@observer
export default class Project extends React.Component<RouteComponentProps<{ id: string }> & Props> {

    list = () => {
        const { setHistory } = this.props.router;
        setHistory(`projects`);
    };

    async componentDidMount() {
        try {
            const {
                getProject
            } = this.props.project;
            const id = Number(this.props.match.params.id);
            const id_person = getUser().id_pessoa;
            await getProject(id, id_person);
        } catch (err) {
            this.list();
        }
    }
  
    render() {
        const {
            project,
            handleDate,
            handleChange,
            isLoading,
            isEditing,
            setEdit
        } = this.props.project
        
        const isCompany = getUser().tipo_pessoa == 0;

        return (
            <Container style={{ padding: 20 }}>
                <Header as="h2">
                    Projetos
                </Header>
                <Segment>
                    <Form loading={isLoading && !isEditing}>
                        <Form.Group style={{ flexDirection: 'row-reverse' }}>
                            <Form.Field>
                                {
                                    !isCompany ? 
                                        (<Icon size="big" name={project.is_favorite ? 'heart' : 'heart outline'} link onClick={() => {}} />)
                                        :
                                        isEditing ?
                                            (<Button primary disabled>Editando</Button>)
                                            :
                                            (<Button primary onClick={() => setEdit(true)}>Editar</Button>)
                                }
                            </Form.Field>
                        </Form.Group>
                        
                        <Form.Group widths='equal'>
                            <Form.Field>
                                <Form.Input
                                    readOnly={!isEditing}
                                    fluid
                                    id="nome"
                                    label='Nome projeto'
                                    value={project.nome}
                                    onChange={handleChange}/>
                            </Form.Field>

                            <Form.Field>
                                <label>Data Limite</label>
                                <ReactDatePicker
                                    readOnly={!isEditing}
                                    id="data_limite"
                                    selected={getDate(project.data_limite)}
                                    isClearable={false}
                                    value={project.data_limite}
                                    dateFormat='dd/MM/yyyy'
                                    onChange={(date: any) => handleDate(date, 'data_limite')}
                                    showYearDropdown
                                    showMonthDropdown/>
                            </Form.Field>

                            <Form.Field>
                                <Form.Input
                                    readOnly={!isEditing}
                                    fluid
                                    id="palavras_chaves" 
                                    label='Palavras chave'
                                    value={project.palavras_chaves}
                                    onChange={handleChange}/>
                            </Form.Field>
                            
                            <Form.Field>
                                <Form.Input
                                    readOnly={!isEditing}
                                    id="area_projeto" 
                                    label='Area projeto'
                                    value={project.area_projeto}
                                    onChange={handleChange}/>
                            </Form.Field>
                        </Form.Group>

                        <Form.Group widths="equal">
                            <Form.Field>
                                <Form.TextArea
                                    readOnly={!isEditing}
                                    id="descricao" 
                                    label='Descriçao'
                                    value={project.descricao}
                                    onChange={handleChange}/>
                            </Form.Field>
                        </Form.Group>

                        <Form.Group style={{ flexDirection: 'row-reverse' }}>
                            <Form.Field>
                                {
                                    !isEditing || !isCompany ?
                                        (
                                            <>
                                                <Button onClick={this.list}>Voltar</Button>
                                            </>
                                        )
                                        :
                                        (
                                            <Button.Group>
                                                <Button onClick={() => setEdit(false)}>Cancelar</Button>
                                                <Button.Or text='ou' />
                                                <Button positive type='submit' loading={isLoading} onClick={() => {}}>Salvar</Button>
                                            </Button.Group>
                                        )
                                }
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </Segment>
            </Container>
        );
    }
}
