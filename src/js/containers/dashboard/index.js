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

const mapState = state => {
  const newState = { ...state.general };

  console.log("dashboard state----->", newState);
  return {
    ...state.general
  };
};

export default withRouter(connect(mapState)(DashboardContainer));
