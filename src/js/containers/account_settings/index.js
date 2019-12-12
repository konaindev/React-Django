import React from "react";
import { connect } from "react-redux";
import AccountSettings from "../../components/account_settings";
import renderWrapper from "../shared/base_container";

const AccountSettingsContainer = props => {
  return renderWrapper(<AccountSettings {...props} />);
};

const mapState = state => {
  return {
    ...state.network,
    ...state.accountSettings
  };
};

export default connect(mapState)(AccountSettingsContainer);
