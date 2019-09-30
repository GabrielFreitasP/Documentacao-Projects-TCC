import * as React from 'react';
import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import ProjectsStore from './store';
import ListProjects from './list-projects';
import NewProject from './new-project';

interface Props {
  projects: ProjectsStore
}

@inject('projects')
@observer
export default class Projects extends React.Component<Props> {
  
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
