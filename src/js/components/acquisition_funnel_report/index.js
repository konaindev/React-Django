import React, { Component } from "react";
import PropTypes from "prop-types";

import BoxRow from "../box_row";
import ReportSection from "../report_section";
import Panel from "../panel";
import {
  FunnelNumberBox,
  FunnelPercentBox,
  FunnelCurrencyBox
} from "../funnel_box_layout";
import {
  formatCurrency,
  formatNumber,
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
    const costPerExe =
      r.funnel?.costs?.exe && formatCurrency(r.funnel.costs.exe);
    const lowestMonthlyRent =
      r.property?.lowest_monthly_rent &&
      formatCurrency(r.property.lowest_monthly_rent);
    const description =
      costPerExe && lowestMonthlyRent && `${costPerExe} / ${lowestMonthlyRent}`;
    return (
      <BoxRow>
        <PercentageGraphBox
          name="USV > EXE"
          infoTooltip="usv_to_exe"
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
          infoTooltip="cost_per_exe_lowest_monthly_rent"
          value={r.property.cost_per_exe_vs_rent}
          target={r.targets?.property?.cost_per_exe_vs_rent}
          delta={r.deltas?.property?.cost_per_exe_vs_rent}
          series={r.whiskers?.cost_per_exe_vs_rent}
          extraContent={description}
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
              infoTooltip="volume_of_usv"
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
              infoTooltip="volume_of_inq"
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
              infoTooltip="volume_of_tou"
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
              infoTooltip="volume_of_app"
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
              infoTooltip="volume_of_exe"
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
              infoTooltip="usv_to_inq"
              value={r.funnel.conversions.usv_inq}
              target={r.targets?.funnel?.conversions?.usv_inq}
              delta={r.deltas?.funnel?.conversions?.usv_inq}
            />
            <FunnelPercentBox
              name="INQ → TOU"
              infoTooltip="inq_to_tou"
              value={r.funnel.conversions.inq_tou}
              target={r.targets?.funnel?.conversions?.inq_tou}
              delta={r.deltas?.funnel?.conversions?.inq_tou}
            />
            <FunnelPercentBox
              name="TOU → APP"
              infoTooltip="tou_to_app"
              value={r.funnel.conversions.tou_app}
              target={r.targets?.funnel?.conversions?.tou_app}
              delta={r.deltas?.funnel?.conversions?.tou_app}
            />
            <FunnelPercentBox
              name="APP → EXE"
              infoTooltip="app_to_exe"
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
              infoTooltip="cost_per_usv"
              value={r.funnel.costs.usv}
              target={r.targets?.funnel?.costs?.usv}
              delta={r.deltas?.funnel?.costs?.usv}
            />
            <FunnelCurrencyBox
              name="Cost per INQ"
              infoTooltip="cost_per_inq"
              value={r.funnel?.costs?.inq}
              target={r.targets?.funnel?.costs?.inq}
              delta={r.deltas?.funnel?.costs?.inq}
            />
            <FunnelCurrencyBox
              name="Cost per TOU"
              infoTooltip="cost_per_tou"
              value={r.funnel.costs.tou}
              target={r.targets?.funnel?.costs?.tou}
              delta={r.deltas?.funnel?.costs?.tou}
            />
            <FunnelCurrencyBox
              name="Cost per APP"
              infoTooltip="cost_per_app"
              value={r.funnel.costs.app}
              target={r.targets?.funnel?.costs?.app}
              delta={r.deltas?.funnel?.costs?.app}
            />
            <FunnelCurrencyBox
              name="Cost per EXE"
              infoTooltip="cost_per_exe"
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
