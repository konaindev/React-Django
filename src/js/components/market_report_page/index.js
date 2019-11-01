import React, { Component } from "react";
import PropTypes from "prop-types";

import ReportPageChrome from "../report_page_chrome";
import TotalAddressableMarket from "../total_addressable_market";

export class MarketReportPage extends Component {
  static propTypes = {
    // report: PropTypes.object.isRequired,
    // project: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  render() {
    const { user, project, report, report_links, share_info } = this.props;

    return (
      <ReportPageChrome
        user={user}
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

export default MarketReportPage;
