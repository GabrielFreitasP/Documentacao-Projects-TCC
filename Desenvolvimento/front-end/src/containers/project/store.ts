import { action, observable } from 'mobx';
import { ProjectInterface } from '../../interfaces/project.interface';
import { assign } from '../../util';

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

  @action handleChange = (event: any, select?: any) => {
    const { id, value } = select || event.target;
    assign(this.project, id, value);
  }

  @action handleDate = (data: Date|null, id: string) => {
    assign(this.project, id, data ? data.toISOString().split('T')[0].split('-').reverse().join('/') : '');
  }

}
const project = new ProjectStore();
export { project };
