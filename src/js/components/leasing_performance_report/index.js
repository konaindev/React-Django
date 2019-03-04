import React, { Component } from "react";
import PropTypes from "prop-types";

import BoxRow from "../box_row";
import BoxColumn from "../box_column";
import BoxTable from "../box_table";
import { LargeBoxLayout } from "../large_box_layout";
import { SmallNumberBox } from "../small_box_layout";
import WhiskerPlot from "../whisker_plot";
import DeltaLayout from "../delta_layout";
import ReportSection from "../report_section";

import {
  formatPercent,
  formatDeltaPercent,
  formatNumber,
  formatTargetPercent
} from "../../utils/formatters.js";

import "./leasing_performance_report.scss";

/**
 * @class LeasingPerformanceReport
 *
 * @classdesc Render the leasing performance section of a full `report`.
 */
export default class LeasingPerformanceReport extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  /**
   * @name LeasingPerformanceReport.HeadlineNumbers
   * @description Component that renders the most important leasing performance numbers.
   */
  static HeadlineNumbers = ({ report: r }) => {
    return (
      <BoxRow>
        <LargeBoxLayout
          name="Leased"
          content={DeltaLayout.build(
            r.property.leasing.rate,
            r.deltas?.property?.leasing?.rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.property.leasing.units
          )} Executed Leases (Out of ${formatNumber(
            r.property.occupancy.occupiable
          )})`}
          detail2={formatTargetPercent(r.targets?.property?.leasing?.rate)}
          innerBox={WhiskerPlot.maybe(r.whiskers?.leased_rate)}
        />
        <LargeBoxLayout
          name="Retention"
          content={DeltaLayout.build(
            r.property.leasing.renewal_rate,
            r.deltas?.property?.leasing?.renewal_rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.property.leasing.renewal_notices
          )} Notices to Renew (Out of ${
            r.property.leasing.resident_decisions
          } Resident Decisions)`}
          detail2={formatTargetPercent(
            r.targets?.property?.leasing?.renewal_rate
          )}
          innerBox={WhiskerPlot.maybe(r.whiskers?.renewal_rate)}
        />
        <LargeBoxLayout
          name="Occupied"
          content={DeltaLayout.build(
            r.property.occupancy.rate,
            r.deltas?.property?.occupancy?.rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.property.occupancy.units
          )} Occupied Units (Out of ${formatNumber(
            r.property.occupancy.occupiable
          )})`}
          detail2={formatTargetPercent(r.targets?.property?.occupancy?.rate)}
          innerBox={WhiskerPlot.maybe(r.whiskers?.occupancy_rate)}
        />
      </BoxRow>
    );
  };

  /**
   * @name LeasingPerformanceReport.DetailNumbers
   * @description Component that renders the secondary leasing performance numbers.
   */
  static DetailNumbers = ({ report: r }) => {
    return (
      <BoxTable>
        <BoxRow>
          <BoxColumn>
            <SmallNumberBox
              name="Lease Applications"
              value={r.funnel.volumes.app}
              target={r.targets?.funnel?.volumes?.app}
              delta={r.deltas?.funnel?.volumes?.app}
            />
            <SmallNumberBox
              name="Cancellations and Denials"
              value={r.property.leasing.cds}
              target={r.targets?.property?.leasing?.cds}
              delta={r.deltas?.property?.leasing?.cds}
            />
          </BoxColumn>
          <BoxColumn>
            <SmallNumberBox
              name="Notices to Renew"
              value={r.property.leasing.renewal_notices}
              target={r.targets?.property?.leasing?.renewal_notices}
              delta={r.deltas?.property?.leasing?.renewal_notices}
            />
            <SmallNumberBox
              name="Notices to Vacate"
              value={r.property.leasing.vacation_notices}
              target={r.targets?.property?.leasing?.vacation_notices}
              delta={r.deltas?.property?.leasing?.vacation_notices}
            />
          </BoxColumn>
          <BoxColumn>
            <SmallNumberBox
              name="Move Ins"
              value={r.property.occupancy.move_ins}
              target={r.targets?.property?.occupancy.move_ins}
              delta={r.deltas?.property?.occupancy?.move_ins}
            />
            <SmallNumberBox
              name="Move Outs"
              value={r.property.occupancy.move_outs}
              target={r.targets?.property?.occupancy?.move_outs}
              delta={r.deltas?.property?.occupancy?.move_outs}
            />
          </BoxColumn>
        </BoxRow>
      </BoxTable>
    );
  };

  /**
   * @description Render the leasing performance report section
   */
  render() {
    return (
      <ReportSection name="Leasing Performance">
        <LeasingPerformanceReport.HeadlineNumbers report={this.props.report} />
        <LeasingPerformanceReport.DetailNumbers report={this.props.report} />
      </ReportSection>
    );
  }
}
