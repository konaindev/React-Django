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
            r.leased_rate,
            r.delta_leased_rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.leased_units
          )} Executed Leases (Out of ${formatNumber(r.occupiable_units)})`}
          detail2={formatTargetPercent(r.target_lease_percent)}
          innerBox={WhiskerPlot.maybe(r.whiskers.leased_rate)}
        />
        <LargeBoxLayout
          name="Retention"
          content={DeltaLayout.build(
            r.renewal_rate,
            r.delta_renewal_rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.lease_renewal_notices
          )} Notices to Renew (Out of ${r.leases_due_to_expire} Due To Expire)`}
          detail2={formatTargetPercent(r.target_renewal_rate)}
          innerBox={WhiskerPlot.maybe(r.whiskers.renewal_rate)}
        />
        <LargeBoxLayout
          name="Occupied"
          content={DeltaLayout.build(
            r.occupancy_rate,
            r.delta_occupancy_rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.occupied_units
          )} Occupied Units (Out of ${formatNumber(r.occupiable_units)})`}
          detail2={formatTargetPercent(r.target_occupancy_rate)}
          innerBox={WhiskerPlot.maybe(r.whiskers.occupancy_rate)}
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
              value={r.lease_applications}
              target={r.target_lease_applications}
              delta={r.delta_lease_applications}
            />
            <SmallNumberBox
              name="Cancellations and Denials"
              value={r.lease_cds}
              target={r.target_lease_cds}
              delta={r.delta_lease_cds}
            />
          </BoxColumn>
          <BoxColumn>
            <SmallNumberBox
              name="Notices to Renew"
              value={r.lease_renewals}
              target={r.target_lease_renewals}
              delta={r.delta_lease_renewals}
            />
            <SmallNumberBox
              name="Notices to Vacate"
              value={r.lease_vacation_notices}
              target={r.target_lease_vacation_notices}
              delta={r.delta_lease_vacation_notices}
            />
          </BoxColumn>
          <BoxColumn>
            <SmallNumberBox
              name="Move Ins"
              value={r.move_ins}
              target={r.target_move_ins}
              delta={r.delta_move_ins}
            />
            <SmallNumberBox
              name="Move Outs"
              value={r.move_outs}
              target={r.target_move_outs}
              delta={r.delta_move_outs}
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
