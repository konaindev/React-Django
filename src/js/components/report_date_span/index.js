import React, { Component } from "react";
import PropTypes from "prop-types";

import { formatDate, formatDateDiff } from "../../utils/formatters";

import "./report_date_span.scss";

export default class ReportDateSpan extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    dates: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <div className="report-date-span__content">
        <span className="report-date-span__content-name">
          {this.props.name} (
          {formatDateDiff(this.props.dates.start, this.props.dates.end, "week")}
          )
        </span>
        <span className="report-date-span__content-dates">
          {formatDate(this.props.dates.start)} -{" "}
          {formatDate(this.props.dates.end)}
        </span>
      </div>
    );
  }
}
