import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { ProjectPage } from "../../components/project_page";

class ProjectsContainer extends PureComponent {
  render() {
    return <div>Projects Container</div>;
  }
}

const mapState = state => ({
  ...state.general,
  ...state.network
});

export default connect(mapState)(ProjectsContainer);
