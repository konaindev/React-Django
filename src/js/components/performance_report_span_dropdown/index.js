import React, { Component } from "react";
import PropTypes from "prop-types";

import "./performance_report_span_dropdown.scss";

/**
 * @class PerformanceReportSpanDropdown
 *
 * @classname A dropdown menu that lets us change the visible performance report span.
 */
export default class PerformanceReportSpanDropdown extends Component {
  static propTypes = {
    current_report_link: PropTypes.object.isRequired,
    report_links: PropTypes.arrayOf(PropTypes.object)
  };

  onChange = event => {
    // TODO what should we do here?
    document.location = event.target.value;
  };

  renderOptions() {
    // handle the case where there are no public report links
    const links = this.props.report_links || [this.props.current_report_link];

    let options = [];
    for (let link of links) {
      options.push(
        <option key={link.url} value={link.url}>
          {link.description}
        </option>
      );
    }
    return options;
  }

  render() {
    return (
      <>
        <span className="report-span-dropdown">
          <select
            defaultValue={this.props.current_report_link.url}
            onChange={this.onChange}
          >
            {this.renderOptions()}
          </select>
        </span>
      </>
    );
  }
}
