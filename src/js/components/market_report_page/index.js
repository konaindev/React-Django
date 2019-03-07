import React, { Component } from "react";

import { TotalAddressableMarket } from "../total_addressable_market";

export default class MarketReportPage extends Component {
  render() {
    // TODO ADD PAGE CHROME!
    return <TotalAddressableMarket {...this.props.report} />;
  }
}