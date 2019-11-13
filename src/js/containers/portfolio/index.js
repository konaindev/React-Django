import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PortfolioAnalysisView from "../../components/portfolio_analysis_view";
import { portfolio } from "../../redux_base/actions";

class PortfolioContainer extends PureComponent {
  componentDidMount() {
    const {
      location: { search }
    } = this.props;
    this.props.dispatch(portfolio.requestGroups(search));
  }

  render() {
    return <PortfolioAnalysisView {...this.props} />;
  }
}

const mapState = state => ({
  ...state.network,
  ...state.portfolio
});

export default withRouter(connect(mapState)(PortfolioContainer));
