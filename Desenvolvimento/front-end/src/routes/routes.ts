import { RouteProps } from 'react-router-dom';
import Home from '../containers/home';
import Project from '../containers/project';
import Projects from '../containers/projects';
const publicUrl = process.env.PUBLIC_URL;

export const routes: RouteProps[] = [
  { path: `${publicUrl}/home`, component: Home },
  { path: `${publicUrl}/project/:id`, component: Project },
  { path: `${publicUrl}/projects`, component: Projects },
];