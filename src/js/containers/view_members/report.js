import React from "react";
import { connect } from "react-redux";

import { ViewMembersModalUI } from "../../components/members_modal";

class ViewMembersModal extends React.PureComponent {
  render() {
    const { project, ...otherProps } = this.props;
    const p = {
      property_name: project?.name,
      members: project?.members
    };
    return <ViewMembersModalUI {...otherProps} property={p} />;
  }
}

const mapState = state => {
  return {
    ...state.viewMembersModal,
    project: state.projectReports?.project
  };
};

export default connect(mapState)(ViewMembersModal);
