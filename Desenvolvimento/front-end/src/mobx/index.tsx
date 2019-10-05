import { router } from './router.store';
import { mainMenu } from '../components/main-menu/store';
import { home } from '../containers/home/store';
import { project } from '../containers/project/store';
import { projects } from '../containers/projects/store';
import { login } from '../containers/login/store';
import { register } from '../containers/register/store';
import { myProjects } from '../containers/my-projects/store';
import { chooseRegisterType } from '../containers/choose-register-type/store';

export {
  router,
  mainMenu,
  login,
  home,
  project,
  projects,
  register,
  myProjects,
  chooseRegisterType
};