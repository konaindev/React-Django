import React from "react";
import { connect } from "react-redux";

import { default as InviteModalUI } from "../../components/invite_modal";

class InviteModal extends React.PureComponent {
  render() {
    const { project, ...props } = this.props;
    let properties = [];
    if (project) {
      const p = {
        property_id: project.public_id,
        property_name: project.name,
        members: project.members
      };
      properties = [p];
    }
    return <InviteModalUI {...props} properties={properties} />;
  }
}

const mapState = state => {
  return {
    ...state.inviteModal,
    project: state.projectReports.project
  };
};

export default connect(mapState)(InviteModal);
