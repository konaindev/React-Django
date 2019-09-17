import React, { PureComponent } from "react";
import { connect } from "react-redux";
import DashboardPage from "../../components/dashboard_page";
import { props } from "../../components/dashboard_page/props";

class DashboardContainer extends PureComponent {
  render() {
    return <DashboardPage {...props} {...this.props} />;
    // return <div>Dash Container</div>;
  }
}

const mapState = state => ({
  ...state.general,
  ...state.network
});

export default connect(mapState)(DashboardContainer);
