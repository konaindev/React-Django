import React, { PureComponent } from "react";
import { connect } from "react-redux";
import DashboardPage from "../../components/dashboard_page";
import { withRouter } from "react-router-dom";
import { dashboard } from "../../state/actions";

class DashboardContainer extends PureComponent {
  componentWillMount() {
    this.props.dispatch(dashboard.update({}));
  }

  render() {
    return <DashboardPage {...this.props} />;
  }
}

const mapState = state => ({
  ...state.network,
  locations: state.locations,
  funds: state.funds,
  properties: state.properties,
  asset_managers: state.asset_managers,
  property_managers: state.property_managers
});

export default withRouter(connect(mapState)(DashboardContainer));
