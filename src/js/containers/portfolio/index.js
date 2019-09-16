import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { PortfolioAnalysisView } from "../../components/portfolio_analysis_view";

class PortfolioContainer extends PureComponent {
  render() {
    // return <PortfolioAnalysisView {...this.props} />;
    return <div>Portfolio Container</div>;
  }
}

const mapState = state => ({
  ...state.general,
  ...state.network
});

export default connect(mapState)(PortfolioContainer);
