import React, { Component } from "react";
import PropTypes from "prop-types";

import BoxColumn from "../box_column";
import BoxRow from "../box_row";
import ReportSection from "../report_section";
import { SmallNumberBox } from "../small_box_layout";

import {
  formatPercent,
  formatDeltaPercent,
  formatNumber,
  formatTargetPercent
} from "../../utils/formatters.js";
import { PercentageGraphBox } from "../large_graph_box";

import "./leasing_performance_report.scss";

/**
 * @class LeasingPerformanceReport
 *
 * @classdesc Render the leasing performance section of a full `report`.
 */
export default class LeasingPerformanceReport extends Component {
  static propTypes = {
    report: PropTypes.object.isRequired,
    sectionItems: PropTypes.node
  };

  /**
   * @name LeasingPerformanceReport.HeadlineNumbers
   * @description Component that renders the most important leasing performance numbers.
   */
  static HeadlineNumbers = ({ report: r, type }) => {
    const leasedCount = formatNumber(r.property.leasing.units);
    const leasedTotal = formatNumber(r.property.occupancy.occupiable);
    const retentionCount = formatNumber(r.property.leasing.renewal_notices);
    const retentionTotal = r.property.leasing.resident_decisions;
    const occupiedCount = formatNumber(r.property.occupancy.units);
    const occupiedTotal = leasedTotal;
    const totalUnits = r.property.total_units;
    const renderTotalUnits = () =>
      totalUnits ? <span>{`${totalUnits} Total Units`}</span> : null;

    return (
      <BoxRow>
        <PercentageGraphBox
          type={type}
          name="Leased"
          infoTooltip="leased_rate"
          value={r.property.leasing.rate}
          delta={r.deltas?.property?.leasing?.rate}
          series={r.whiskers?.leased_rate}
          target={r.targets?.property?.leasing?.rate}
          extraContent={
            <>
              <span>{`${leasedCount} Executed Leases (Out of ${leasedTotal})`}</span>
            </>
          }
        />
        <PercentageGraphBox
          type={type}
          name="Retention"
          infoTooltip="retention_rate"
          value={r.property.leasing.renewal_rate}
          delta={r.deltas?.property?.leasing?.renewal_rate}
          series={r.whiskers?.renewal_rate}
          target={r.targets?.property?.leasing?.renewal_rate}
          extraContent={`${retentionCount} Notices to Renew (Out of ${retentionTotal})`}
        />
        <PercentageGraphBox
          type={type}
          name="Occupied"
          infoTooltip="occupied_rate"
          value={r.property.occupancy.rate}
          delta={r.deltas?.property?.occupancy?.rate}
          series={r.whiskers?.occupancy_rate}
          target={r.targets?.property?.occupancy?.rate}
          extraContent={
            <>
              <span>{`${occupiedCount} Occupied Units (Out of ${occupiedTotal})`}</span>
            </>
          }
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
      <div className="lease-performance-report__detail-numbers">
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
      </div>
    );
  };

  /**
   * @description Render the leasing performance report section
   */
  render() {
    return (
      <ReportSection
        name="Leasing Performance"
        sectionItems={this.props.sectionItems}
        smallMarginTop
      >
        <LeasingPerformanceReport.HeadlineNumbers
          type={this.props?.type}
          report={this.props.report}
        />
        <LeasingPerformanceReport.DetailNumbers report={this.props.report} />
      </ReportSection>
    );
  }
}
