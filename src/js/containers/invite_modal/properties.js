import React from "react";
import { connect } from "react-redux";

import { InviteModalUI } from "../../components/members_modal";

class InviteModal extends React.PureComponent {
  render() {
    return <InviteModalUI {...this.props} />;
  }
}

const mapState = state => {
  return {
    ...state.inviteModal,
    properties: state.dashboard?.selectedProperties || []
  };
};

export default connect(mapState)(InviteModal);
