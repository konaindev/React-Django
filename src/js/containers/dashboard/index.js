import React, { PureComponent } from "react";
import { connect } from "react-redux";
import DashboardPage from "../../components/dashboard_page";
import { withRouter } from "react-router-dom";
import { dashboard } from "../../redux_base/actions";

class DashboardContainer extends PureComponent {
  componentWillMount() {
    this.props.dispatch(dashboard.update({}));
  }

  render() {
    return <DashboardPage {...this.props} />;
  }
}

const mapState = ({ general }) => ({ ...general });

export default withRouter(connect(mapState)(DashboardContainer));
