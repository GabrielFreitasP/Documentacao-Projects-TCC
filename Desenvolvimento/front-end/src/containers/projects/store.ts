import { action, observable } from 'mobx';
import { ProjectInterface } from '../../interfaces/project.interface';
import { assign } from '../../util';
import { postProject, getProjects } from '../../api/projects.api';

const initialNewProject = {
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

const initialFilter = {
  nome_projeto: '',
  nome_empresa: '',
  palavras_chave: '',
  area_projeto: '',
  data_limite: '',
}

export default class ProjectsStore {

  private _filter: any = null

  @observable newProject: ProjectInterface = initialNewProject;

  @observable filter: {
    nome_projeto: string;
    nome_empresa: string;
    palavras_chave: string;
    area_projeto: string;
    data_limite: string;
  } = initialFilter;

  @observable records: any[] = [];

  @observable isLoading: boolean = false;

  @observable showNewProjectScreen: boolean = false;

  @action toggleScreen = () => {
    this.showNewProjectScreen = !this.showNewProjectScreen;
    if (this.showNewProjectScreen) {
      this.handleClear();
    } else {
      this.newProject = initialNewProject;
    }
  }

  @action handleClear = () => {
    this.filter = initialFilter;
    this._filter = initialFilter;
  }

  @action handleChangeNew = (event: any, select?: any) => {
    const { id, value } = select || event.target;
    assign(this.newProject, id, value);
  };

  @action handleChangeFilter = (event: any, select?: any) => {
    const { id, value } = select || event.target;
    assign(this.filter, id, value);
  };

  @action handleDateNew = (data: Date|null, id: string) => {
    assign(this.newProject, id, data ? data.toISOString().split('T')[0].split('-').reverse().join('/') : '');
  }

  @action handleDateFilter = (data: Date|null, id: string) => {
    assign(this.filter, id, data ? data.toISOString().split('T')[0].split('-').reverse().join('/') : '');
  }

  @action handleSubmitFilter = (companyId?: number) => {
    this._filter = { ...this.filter };
    this.getProjects(companyId);
  }

  @action handleSubmit = (id_empresa: number) => {
    this.isLoading = true;
    const data = { ...this.newProject, id_empresa }
    postProject(data)
      .then((res) => {
        console.log(res);
        this.toggleScreen();
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => this.isLoading = false);
  }

  @action getProjects = (companyId?: number) => {
    this.isLoading = true;
    const data = { ...this._filter }
    getProjects(data, companyId)
      .then((res) => {
        this.records = res.data.records;
      })
      .catch(err => {
        console.error(err);
        this.records = [];
      })
      .finally(() => this.isLoading = false);
  }

}
const projects = new ProjectsStore();
export { projects };
