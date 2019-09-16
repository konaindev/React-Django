import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { DashboardPage } from "../../components/dashboard_page";

class DashboardContainer extends PureComponent {
  render() {
    // return <DashboardPage {...this.props} />;
    return <div>Dash Container</div>;
  }
}

const mapState = state => ({
  ...state.general,
  ...state.network
});

export default connect(mapState)(DashboardContainer);
