import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PortfolioAnalysisView from "../../components/portfolio_analysis_view";
import { props } from "../../components/portfolio_analysis_view/props";

class PortfolioContainer extends PureComponent {
  render() {
    console.log(props);
    return <PortfolioAnalysisView {...props} {...this.props} />;
  }
}

const mapState = state => ({
  ...state.general,
  ...state.network
});

export default connect(mapState)(PortfolioContainer);
