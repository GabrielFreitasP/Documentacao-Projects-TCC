import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Container, Header, Segment, Form, Button, Grid, Icon } from 'semantic-ui-react';
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

    handleFavorite = async () => {
        const { postMyProject } = this.props.project;
        const id_dev = getUser().id_pessoa;
        await postMyProject(id_dev);
    }

    handleSubmit = async (e: any) => {
        e.preventDefault();
        const { saveProject } = this.props.project;
        await saveProject();
        this.list();
    }

    async componentDidMount() {
        try {
            const { getProject } = this.props.project;
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
        } = this.props.project;
        
        const isCompany = getUser().tipo_pessoa === 0;

        return (
            <Container style={{ padding: 20 }}>
                <Header as="h2">
                    Projetos
                </Header>
                <Segment>
                    <Grid style={{ marginBottom: 5 }}>
                        <Grid.Row style={{ justifyContent: 'space-between' }}>
                            <Grid.Column width="8">
                                <Header as='h2'>
                                    {
                                        isEditing ? 'Editar' : 'Visualizar'
                                    }
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Form loading={isLoading && !isEditing}>                        
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
                                    !isCompany ?
                                        !project.is_favorite ? 
                                            (<Button color={'green'} onClick={this.handleFavorite}>
                                                <Icon name='add' />
                                                Adicionar ao Meus Projetos
                                            </Button>)
                                            :
                                            (<Button color={'red'} onClick={this.handleFavorite}>
                                                <Icon name='delete' />
                                                Remover dos Meus Projetos
                                            </Button>)                                        
                                        :
                                        isEditing ?
                                            (<>
                                                <Button color='red' loading={isLoading} style={{marginRight: 10}}>
                                                    <Icon name='trash' />
                                                    Excluir
                                                </Button>
                                                <Button positive loading={isLoading} onClick={this.handleSubmit}>
                                                    <Icon name='check' />
                                                    Salvar
                                                </Button>
                                            </>)
                                            :
                                            (<>
                                                <Button color='red' loading={isLoading} style={{marginRight: 10}}>
                                                    <Icon name='trash' />
                                                    Excluir
                                                </Button>
                                                <Button primary onClick={() => setEdit(true)}>
                                                    <Icon name='pencil' />
                                                    Habilitar Edição
                                                </Button>
                                            </>)
                                       
                                }
                            </Form.Field>
                            
                            <Button basic onClick={() => { setEdit(false); this.list(); }}>
                                <Icon name='arrow left' />
                                Voltar
                            </Button>
                        </Form.Group>
                    </Form>
                </Segment>
            </Container>
        );
    }
}
