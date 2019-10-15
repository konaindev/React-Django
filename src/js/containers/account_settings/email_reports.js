import React from "react";
import { connect } from "react-redux";

import EmailReports from "../../components/account_settings/email_reports";

const EmailReportsContainer = props => <EmailReports {...props} />;

const mapState = state => ({ properties: state.accountSettings.properties });

export default connect(mapState)(EmailReportsContainer);
