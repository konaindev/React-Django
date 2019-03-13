import React, { Component } from "react";
import PropTypes from "prop-types";

import BoxRow from "../box_row";
import BoxColumn from "../box_column";
import ReportSection from "../report_section";
import Panel from "../panel";
import WhiskerPlot from "../whisker_plot";
import {
  FunnelNumberBox,
  FunnelPercentBox,
  FunnelCurrencyBox
} from "../funnel_box_layout";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDeltaPercent,
  targetFormatter
} from "../../utils/formatters.js";
import { PercentageGraphBox } from "../large_graph_box";

import "./acquisition_funnel_report.scss";

const formatTargetNumber = targetFormatter(formatNumber);

const format4WeekAverage = averageValue =>
  averageValue == null ? (
    <span>&nbsp;</span>
  ) : (
    `4-Week Average: ${formatNumber(averageValue)}`
  );

/**
 * @class AcqusitionFunnelReport
 *
 * @classdesc Render the acquisition funnel table
 */
export default class AcquisitionFunnelReport extends Component {
  static propTypes = {
    report: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["baseline", "performance"]).isRequired
  };
  /**
   * @name AcquisitionFunnelReport.HeadlineNumbers
   * @description Component that renders headline acquisition funnel numbers
   */
  static HeadlineNumbers = ({ report: r }) => {
    return (
      <BoxRow>
        <PercentageGraphBox
          name="USV > EXE"
          value={r.funnel.conversions.usv_exe}
          target={r.targets?.funnel?.conversions?.usv_exe}
          delta={r.deltas?.funnel?.conversions?.usv_exe}
          series={r.whiskers?.usv_exe}
          digits={2}
        />
        <PercentageGraphBox
          name="Cancellation & Denial Rate"
          value={r.property.leasing.cd_rate}
          target={r.targets?.property?.leasing?.cd_rate}
          delta={r.deltas?.property?.leasing?.cd_rate}
          series={r.whiskers?.lease_cd_rate}
        />
        {/* we reverse the arrow here because declining percentages are *good* */}
        <PercentageGraphBox
          name="Cost per Exe / Lowest Monthly Rent"
          value={r.property.cost_per_exe_vs_rent}
          target={r.targets?.property?.cost_per_exe_vs_rent}
          delta={r.deltas?.property?.cost_per_exe_vs_rent}
          series={r.whiskers?.cost_per_exe_vs_rent}
        />
      </BoxRow>
    );
  };

  /**
   * @name AcquisitionFunnelReport.FunnelTable
   * @description Component that lays out the table content columns
   */
  static FunnelTable = ({ children }) => {
    return <div className="acquisition-funnel__table">{children}</div>;
  };

  static FunnelColumn = ({ children }) => (
    <div className="acquisition-funnel__column">
      <Panel className="acquisition-funnel__column-inner">{children}</Panel>
    </div>
  );

  static FunnelRow = ({ children }) => (
    <div className="acquisition-funnel__row">{children}</div>
  );

  static FunnelColumnHeader = ({ name }) => (
    <div className="acquisition-funnel__column-header">{name}</div>
  );

  static FunnelColumnContent = ({ children }) => (
    <div className="acquisition-funnel__column-content">{children}</div>
  );

  static FunnelContent = ({ report: r, type }) => {
    const targetFormatter =
      type === "performance" ? formatTargetNumber : format4WeekAverage;
    return (
      <AcquisitionFunnelReport.FunnelRow>
        <AcquisitionFunnelReport.FunnelColumn>
          <AcquisitionFunnelReport.FunnelColumnHeader name="Volume of Activity" />
          <AcquisitionFunnelReport.FunnelColumnContent>
            <FunnelNumberBox
              name="Volume of USV"
              value={r.funnel.volumes.usv}
              target={
                type === "performance"
                  ? r.targets?.funnel?.volumes?.usv
                  : r.four_week_funnel_averages?.usv
              }
              delta={r.deltas?.funnel?.volumes?.usv}
              targetFormatter={targetFormatter}
            />
            <FunnelNumberBox
              name="Volume of INQ"
              value={r.funnel.volumes.inq}
              target={
                type === "performance"
                  ? r.targets?.funnel?.volumes?.inq
                  : r.four_week_funnel_averages?.inq
              }
              delta={r.deltas?.funnel?.volumes?.inq}
              targetFormatter={targetFormatter}
            />
            <FunnelNumberBox
              name="Volume of TOU"
              value={r.funnel.volumes.tou}
              target={
                type === "performance"
                  ? r.targets?.funnel?.volumes?.tou
                  : r.four_week_funnel_averages?.tou
              }
              delta={r.deltas?.funnel?.volumes?.tou}
              targetFormatter={targetFormatter}
            />
            <FunnelNumberBox
              name="Volume of APP"
              value={r.funnel.volumes.app}
              target={
                type === "performance"
                  ? r.targets?.funnel?.volumes?.app
                  : r.four_week_funnel_averages?.app
              }
              delta={r.deltas?.funnel?.volumes?.app}
              targetFormatter={targetFormatter}
            />
            <FunnelNumberBox
              name="Volume of EXE"
              value={r.funnel.volumes.exe}
              target={
                type === "performance"
                  ? r.targets?.funnel?.volumes?.exe
                  : r.four_week_funnel_averages?.exe
              }
              delta={r.deltas?.funnel?.volumes?.exe}
              targetFormatter={targetFormatter}
            />
          </AcquisitionFunnelReport.FunnelColumnContent>
        </AcquisitionFunnelReport.FunnelColumn>

        <AcquisitionFunnelReport.FunnelColumn>
          <AcquisitionFunnelReport.FunnelColumnHeader name="Conversion Rate" />
          <AcquisitionFunnelReport.FunnelColumnContent>
            <FunnelPercentBox
              name="USV → INQ"
              value={r.funnel.conversions.usv_inq}
              target={r.targets?.funnel?.conversions?.usv_inq}
              delta={r.deltas?.funnel?.conversions?.usv_inq}
            />
            <FunnelPercentBox
              name="INQ → TOU"
              value={r.funnel.conversions.inq_tou}
              target={r.targets?.funnel?.conversions?.inq_tou}
              delta={r.deltas?.funnel?.conversions?.inq_tou}
            />
            <FunnelPercentBox
              name="TOU → APP"
              value={r.funnel.conversions.tou_app}
              target={r.targets?.funnel?.conversions?.tou_app}
              delta={r.deltas?.funnel?.conversions?.tou_app}
            />
            <FunnelPercentBox
              name="APP → EXE"
              value={r.funnel.conversions.app_exe}
              target={r.targets?.funnel?.conversions?.app_exe}
              delta={r.deltas?.funnel?.conversions?.app_exe}
            />
          </AcquisitionFunnelReport.FunnelColumnContent>
        </AcquisitionFunnelReport.FunnelColumn>

        <AcquisitionFunnelReport.FunnelColumn>
          <AcquisitionFunnelReport.FunnelColumnHeader name="Cost per Activity" />
          <AcquisitionFunnelReport.FunnelColumnContent>
            <FunnelCurrencyBox
              name="Cost per USV"
              value={r.funnel.costs.usv}
              target={r.targets?.funnel?.costs?.usv}
              delta={r.deltas?.funnel?.costs?.usv}
            />
            <FunnelCurrencyBox
              name="Cost per INQ"
              value={r.funnel?.costs?.inq}
              target={r.targets?.funnel?.costs?.inq}
              delta={r.deltas?.funnel?.costs?.inq}
            />
            <FunnelCurrencyBox
              name="Cost per TOU"
              value={r.funnel.costs.tou}
              target={r.targets?.funnel?.costs?.tou}
              delta={r.deltas?.funnel?.costs?.tou}
            />
            <FunnelCurrencyBox
              name="Cost per APP"
              value={r.funnel.costs.app}
              target={r.targets?.funnel?.costs?.app}
              delta={r.deltas?.funnel?.costs?.app}
            />
            <FunnelCurrencyBox
              name="Cost per EXE"
              value={r.funnel.costs.exe}
              target={r.targets?.funnel?.costs?.exe}
              delta={r.deltas?.funnel?.costs?.exe}
            />
          </AcquisitionFunnelReport.FunnelColumnContent>
        </AcquisitionFunnelReport.FunnelColumn>
      </AcquisitionFunnelReport.FunnelRow>
    );
  };

  render() {
    const { report, type } = this.props;

    return (
      <ReportSection name="Acquisition Funnel">
        <AcquisitionFunnelReport.HeadlineNumbers report={report} />
        <AcquisitionFunnelReport.FunnelTable>
          <AcquisitionFunnelReport.FunnelContent report={report} type={type} />
        </AcquisitionFunnelReport.FunnelTable>
      </ReportSection>
    );
  }
}
