import React, { Component } from "react";

import ModelingView from "../modeling_view";

export default class ModelingReportPage extends Component {
  render() {
    // TODO ADD PAGE CHROME!
    return <ModelingView {...this.props.report} />;
  }
}
