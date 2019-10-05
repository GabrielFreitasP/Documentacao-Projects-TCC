import { observable, action } from 'mobx';
import { getMyProjects } from '../../api/projects.api';

export default class MyProjectsStore {
  @observable records: any[] = [];

  @observable isLoading: boolean = true;

  @action getMyProjects = (id_person: number) => {
    this.isLoading = true;
    getMyProjects(id_person)
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
const myProjects = new MyProjectsStore();
export { myProjects };
