import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../container";
import SectionHeader from "../section_header";
import { formatDate, formatDateDiff } from "../../utils/formatters";
import "./report_section.scss";

/**
 * @class ReportSection
 *
 * @classdesc A named, grouped section of a report.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
export default class ReportSection extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    reportInfo: PropTypes.shape({
      name: PropTypes.string.isRequired,
      dates: PropTypes.object.isRequired
    }),
    smallMarginTop: PropTypes.bool
  };

  render() {
    const { reportInfo, smallMarginTop } = this.props;
    return (
      <div className="report-section">
        <SectionHeader title={this.props.name} smallMarginTop={smallMarginTop}>
          {reportInfo && (
            <div className="report-section__content">
              <span className="report-section__content-name">
                {reportInfo.name} (
                {formatDateDiff(reportInfo.dates.end, reportInfo.dates.start)})
              </span>
              <span className="report-section__content-dates">
                {formatDate(reportInfo.dates.start)} -{" "}
                {formatDate(reportInfo.dates.end)}
              </span>
            </div>
          )}
        </SectionHeader>
        {this.props.children}
      </div>
    );
  }
}
