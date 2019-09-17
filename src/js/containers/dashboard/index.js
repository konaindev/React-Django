import React, { PureComponent } from "react";
import { connect } from "react-redux";
import DashboardPage from "../../components/dashboard_page";
import { props } from "../../components/dashboard_page/props";
import { withRouter } from "react-router-dom";

class DashboardContainer extends PureComponent {
  render() {
    return <DashboardPage {...props} {...this.props} />;
  }
}

const mapState = state => ({
  ...state.general,
  ...state.network
});

export default withRouter(connect(mapState)(DashboardContainer));
