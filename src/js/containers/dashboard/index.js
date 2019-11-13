import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import DashboardPage from "../../components/dashboard_page";
import { dashboard } from "../../redux_base/actions";

class DashboardContainer extends PureComponent {
  componentDidMount() {
    const {
      location: { search }
    } = this.props;
    this.props.dispatch(dashboard.requestProperties(search));
  }

  render() {
    return <DashboardPage {...this.props} />;
  }
}

const mapState = ({ dashboard }) => ({ ...dashboard });

export default withRouter(connect(mapState)(DashboardContainer));
