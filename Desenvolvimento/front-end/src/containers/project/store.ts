import { action, observable } from 'mobx';
import { ProjectInterface } from '../../interfaces/project.interface';
import { assign } from '../../util';
import { getProject } from '../../api/projects.api';

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
    }
    this.isLoading = false;
  }

}
const project = new ProjectStore();
export { project };
