import * as React from 'react';
import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import ProjectsStore from './store';
import ListProjects from './list-projects';
import NewProject from './new-project';
import NewRouterStore from '../../mobx/router.store';

interface Props {
  router: NewRouterStore,
  projects: ProjectsStore
}

@inject('router', 'projects')
@observer
export default class Projects extends React.Component<Props> {

  componentDidMount() {
    this.props.projects.handleClear();
    this.props.projects.handleSubmitFilter();
  }

  componentWillUnmount() {
    this.props.projects.showNewProjectScreen = false;
    this.props.projects.handleClear();
    this.props.projects.handleSubmitFilter();
  }
  
  render() {
    const { 
      showNewProjectScreen
    } = this.props.projects;
    return (
      <Container style={{ padding: 20 }}>
        {
          showNewProjectScreen ?
            <NewProject { ...this.props }/>
            :
            <ListProjects { ...this.props }/>
        }
      </Container>
    );
  }
}
