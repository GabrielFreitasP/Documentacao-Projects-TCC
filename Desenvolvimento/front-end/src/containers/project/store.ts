import { action, observable } from 'mobx';
import { ProjectInterface } from '../../interfaces/project.interface';
import { assign } from '../../util';
import { getProject, putProject } from '../../api/projects.api';
import { error } from '../../components/notifications';

const initialProject = {
  id: 0,
  nome: '',
  id_empresa: 0,
  palavras_chaves: '',
  area_projeto: '',
  data_limite: '',
  descricao: ''
}

export default class ProjectStore {

  @observable project: ProjectInterface = initialProject;

  @observable isLoading: boolean = false;

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
    } catch(err) {
      error("Falha ao salvar projeto!");
      console.error(err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

}
const project = new ProjectStore();
export { project };
