import React, { Component } from "react";
import PropTypes from "prop-types";

import PageChrome from "../page_chrome";
import "./dashboard_page.scss";

export default class DashboardPage extends Component {
  render() {
    return (
      <PageChrome>
        <div className="dashboard-content">
          <p>(User dashboard coming soon!)</p>
        </div>
      </PageChrome>
    );
  }
}
