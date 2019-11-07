import React, { PureComponent } from "react";
import { connect } from "react-redux";
import DashboardPage from "../../components/dashboard_page";
import { withRouter } from "react-router-dom";
import { dashboard } from "../../redux_base/actions";

class DashboardContainer extends PureComponent {
  componentWillMount() {
    this.props.dispatch(dashboard.requestProperties());
  }

  render() {
    return <DashboardPage {...this.props} />;
  }
}

const mapState = ({ dashboard }) => ({ ...dashboard });

export default withRouter(connect(mapState)(DashboardContainer));
