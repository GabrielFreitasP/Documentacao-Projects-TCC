import { RouteProps } from 'react-router-dom';
import Home from '../containers/home';
import Project from '../containers/project';
import Projects from '../containers/projects';
import MyProjects from '../containers/my-projects';
const publicUrl = process.env.PUBLIC_URL;

export const routes: RouteProps[] = [
  { path: `${publicUrl}/home`, component: Home },
  { path: `${publicUrl}/projects/:id`, component: Project },
  { path: `${publicUrl}/projects`, component: Projects },
  { path: `${publicUrl}/my-projects`, component: MyProjects },
];