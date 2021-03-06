import { action, observable } from 'mobx';
import { ProjectInterface } from '../../interfaces/project.interface';
import { assign } from '../../util';
import { getProject, putProject, postMyProject } from '../../api/projects.api';
import { error } from '../../components/notifications';

const initialProject = {
  id: 0,
  nome: '',
  id_empresa: 0,
  empresa: {
    id: 0,
    nome: '',
  },
  palavras_chave: '',
  area_projeto: '',
  data_limite: '',
  descricao: ''
}

export default class ProjectStore {

  @observable project: ProjectInterface = initialProject;

  @observable isLoading: boolean = false;

  @observable isRemoving: boolean = false;

  @observable isEditing: boolean = false;

  @action setEdit = (isEditing : boolean) => {
    this.isEditing = isEditing;
  } 

  @action handleChange = (event: any, select?: any) => {
    const { id, value } = select || event.target;
    assign(this.project, id, value);
  }

  @action handleDate = (data: Date|null, id: string) => {
    assign(this.project, id, data ? data.toISOString().split('T')[0].split('-').reverse().join('/') : '');
  }

  @action getProject = async (id_project: number, id_person: number) => {
    this.isLoading = true;
    try {
      const { data } = await getProject(id_project, id_person)
      this.project = data;
    } catch(err) {
      console.error(err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  @action saveProject = async () => {
    this.isLoading = true;
    try {
      await putProject({ ...this.project });
      this.isEditing = false;
    } catch(err) {
      error("Falha ao salvar projeto!");
      console.error(err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  @action postMyProject = async (id_dev: number) => {
    this.isLoading = true;
    if (!this.project.id) {
      // eslint-disable-next-line
      throw 'Id do projeto nao encontrado';
    }
    try {
      await postMyProject(this.project.id, id_dev, this.project.is_favorite);
      this.project.is_favorite = !this.project.is_favorite;
    } catch(err) {
      error("Falha ao adicionar aos meus projetos!");
      console.error(err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

}
const project = new ProjectStore();
export { project };
