import React from "react";
import { connect } from "react-redux";

import AccountSettings from "../../components/account_settings";
import { accountSettings as actions } from "../../redux_base/actions";
import renderWrapper from "../shared/base_container";

class AccountSettingsContainer extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch(actions.requestSettings());
  }

  render() {
    return renderWrapper(<AccountSettings {...this.props} />);
  }
}

const mapState = state => {
  return {
    ...state.network,
    ...state.accountSettings
  };
};

export default connect(mapState)(AccountSettingsContainer);
