import React, { Component } from "react";
import PropTypes from "prop-types";

import "./report_span_dropdown.scss";

/**
 * @description A dropdown menu that lets us change the visible span.
 */
export default class ReportSpanDropdown extends Component {
  static propTypes = {
    current_report_link: PropTypes.object.isRequired,
    report_links: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  onChange = event => {
    // TODO what should we do here?
    document.location = event.target.value;
  };

  renderOptions() {
    let options = [];
    for (let section of this.props.report_links) {
      // ignore section.name for now?
      for (let link of section.periods) {
        options.push(
          <option key={link.url} value={link.url}>
            {link.description}
          </option>
        );
      }
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
