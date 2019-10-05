import { observable } from 'mobx';

export default class MyProjectsStore {
  @observable records: any[] = [];
}
const myProjects = new MyProjectsStore();
export { myProjects };
