import React, { Component } from "react";
import PropTypes from "prop-types";


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
        <span
          className="cursor-pointer inline-block align-middle mx-4 -my-4 px-4 py-2 rounded"
          style={{ backgroundColor: "#232837" }}
        >
          <select
            className="k-dropdown"
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
