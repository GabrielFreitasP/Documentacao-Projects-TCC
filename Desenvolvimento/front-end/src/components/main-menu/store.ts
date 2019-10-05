import { action, observable } from 'mobx';
import { getUser } from '../../util/auth.util';

export default class MainMenuStore {

  @observable activated: string = this.getActiveMenu();
  getActiveMenu() {
    const [, activeMenu] = window.location.pathname.split('/');
    return activeMenu || 'home';
  };

  @observable routes: any[] = [];

  @action setMenuActive = (name: string) => {
    this.activated = name;
  };

  @action setRoutes = () => {
    let isCompany: boolean = getUser().tipo_pessoa === 0;

    this.routes = [
      {
        title: 'Meus Projetos',
        description:
          isCompany
            ? 'Visualize todos seus projetos criados e gerencie-os.'
            : 'Visualize os projetos em que você está participando.',
        route: 'my-projects',
        color: 'blue'
      },
      {
        title: 'Procurar Projeto',
        description: 'Pesquise por projetos com a ajuda de filtros.',
        route: 'projects',
        color: 'blue'
      },
      {
        title: 'Procurar Empresa',
        description: 'Pesquise por empresas cadastradas na plataforma.',
        route: 'companies',
        color: 'blue'
      }
    ]

    if (isCompany) {
      const newProject = {
        title: 'Novo Projeto',
        description: 'Precisa de programadores para lhe ajudar? Crie um projeto agora!',
        route: 'projects',
        color: 'blue'
      };

      this.routes.splice(1, 0, newProject);
    }
  };

}

const mainMenu = new MainMenuStore();
export { mainMenu };