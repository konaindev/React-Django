import React from "react";
import { connect } from "react-redux";

import EmailReports from "../../components/account_settings/email_reports";

const EmailReportsContainer = props => <EmailReports {...props} />;

const mapState = state => {
  return {
    properties: state.accountSettings.properties,
    pageNum: state.accountSettings.pageNum,
    hasNextPage: state.accountSettings.hasNextPage
  };
};

export default connect(mapState)(EmailReportsContainer);
