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
    const { project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
        project={project}
        current_report_name="market"
        report_links={report_links}
        share_info={share_info}
      >
        <TotalAddressableMarket {...report} />
      </ReportPageChrome>
    );
  }
}
