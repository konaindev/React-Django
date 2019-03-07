import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import TotalAddressableMarket from "../total_addressable_market";

export default class MarketReportPage extends Component {
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  render() {
    return (
      <ReportPageChrome
        project={this.props.project}
        current_report_name="market"
        report_links={this.props.report_links}
      >
        <TotalAddressableMarket {...this.props.report} />
      </ReportPageChrome>
    );
  }
}
