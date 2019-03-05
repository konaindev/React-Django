import React, { Component } from "react";
import PropTypes from "prop-types";

import BoxRow from "../box_row";
import BoxColumn from "../box_column";
import ReportSection from "../report_section";
import WhiskerPlot from "../whisker_plot";
import {
  LargeBoxLayout,
  LargeDetailPercentBox,
  LargePercentBox
} from "../large_box_layout";
import DeltaLayout from "../delta_layout";

import {
  FunnelNumberBox,
  FunnelPercentBox,
  FunnelCurrencyBox
} from "../funnel_box_layout";

import {
  formatCurrency,
  formatPercent,
  formatDeltaPercent,
  formatTargetPercent
} from "../../utils/formatters.js";

import "./acquisition_funnel_report.scss";

/**
 * @class AcqusitionFunnelReport
 *
 * @classdesc Render the acquisition funnel table
 */
export default class AcquisitionFunnelReport extends Component {
  /**
   * @name AcquisitionFunnelReport.HeadlineNumbers
   * @description Component that renders headline acquisition funnel numbers
   */
  static HeadlineNumbers = ({ report: r }) => {
    return (
      <BoxRow>
        <LargeDetailPercentBox
          name="USV > EXE"
          value={r.funnel.conversions.usv_exe}
          target={r.targets?.funnel?.conversions?.usv_exe}
          delta={r.deltas?.funnel?.conversions?.usv_exe}
          innerBox={WhiskerPlot.maybe(r.whiskers?.usv_exe)}
        />
        <LargePercentBox
          name="Cancellation & Denial Rate"
          value={r.property.leasing.cd_rate}
          target={r.targets?.property?.leasing?.cd_rate}
          delta={r.deltas?.property?.leasing?.cd_rate}
          innerBox={WhiskerPlot.maybe(r.whiskers?.lease_cd_rate)}
        />
        <LargeBoxLayout
          name="Cost Per EXE / Lowest Monthly Rent"
          content={DeltaLayout.build(
            r.property.cost_per_exe_vs_rent,
            r.deltas?.property?.cost_per_exe_vs_rent,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatCurrency(r.funnel.costs.exe)} / ${formatCurrency(
            r.property.lowest_monthly_rent
          )}`}
          detail2={formatTargetPercent(
            r.targets?.property?.cost_per_exe_vs_rent
          )}
          innerBox={WhiskerPlot.maybe(r.whiskers?.cost_per_exe_vs_rent)}
        />
      </BoxRow>
    );
  };

  /**
   * @name AcquisitionFunnelReport.FunnelTable
   * @description Component that lays out the table header and content columns
   */
  static FunnelTable = ({ header, content }) => {
    return (
      <div className="acquisition-funnel-table">
        <div className="header-container">{header}</div>
        <div className="content-container">{content}</div>
      </div>
    );
  };

  static FunnelHeaderBox = ({ number, name, more }) => {
    return (
      <div className="acquisition-funnel-label">
        <div className={`name-${number}`}>
          <div>{name}</div>
        </div>
        <div className={`arrow-${number + 1}`}>
          {more ? "↓" : <span>&nbsp;</span>}
        </div>
      </div>
    );
  };

  static FunnelHeader = () => {
    return (
      <BoxColumn>
        <AcquisitionFunnelReport.FunnelHeaderBox
          number={1}
          name="Unique Site Visitors (USV)"
          more={true}
        />
        <AcquisitionFunnelReport.FunnelHeaderBox
          number={2}
          name="Inquiries (INQ)"
          more={true}
        />
        <AcquisitionFunnelReport.FunnelHeaderBox
          number={3}
          name="Tours (TOU)"
          more={true}
        />
        <AcquisitionFunnelReport.FunnelHeaderBox
          number={4}
          name="Lease Applications (APP)"
          more={true}
        />
        <AcquisitionFunnelReport.FunnelHeaderBox
          number={5}
          name="Lease Executions (EXE)"
          more={false}
        />
      </BoxColumn>
    );
  };

  static FunnelContent = ({ report: r }) => {
    return (
      <BoxRow externalMargin={false}>
        <BoxColumn>
          <FunnelNumberBox
            name="Volume of USV"
            value={r.funnel.volumes.usv}
            target={r.targets?.funnel?.volumes?.usv}
            delta={r.deltas?.funnel?.volumes?.usv}
          />
          <FunnelNumberBox
            name="Volume of INQ"
            value={r.funnel.volumes.inq}
            target={r.targets?.funnel?.volumes?.inq}
            delta={r.deltas?.funnel?.volumes?.inq}
          />
          <FunnelNumberBox
            name="Volume of TOU"
            value={r.funnel.volumes.tou}
            target={r.targets?.funnel?.volumes?.tou}
            delta={r.deltas?.funnel?.volumes?.tou}
          />
          <FunnelNumberBox
            name="Volume of APP"
            value={r.funnel.volumes.app}
            target={r.targets?.funnel?.volumes?.app}
            delta={r.deltas?.funnel?.volumes?.app}
          />
          <FunnelNumberBox
            name="Volume of EXE"
            value={r.funnel.volumes.exe}
            target={r.targets?.funnel?.volumes?.exe}
            delta={r.deltas?.funnel?.volumes?.exe}
          />
        </BoxColumn>

        <BoxColumn>
          <FunnelPercentBox
            name="USV > INQ"
            value={r.funnel.conversions.usv_inq}
            target={r.targets?.funnel?.conversions?.usv_inq}
            delta={r.deltas?.funnel?.conversions?.usv_inq}
          />
          <FunnelPercentBox
            name="INQ > TOU"
            value={r.funnel.conversions.inq_tou}
            target={r.targets?.funnel?.conversions?.inq_tou}
            delta={r.deltas?.funnel?.conversions?.inq_tou}
          />
          <FunnelPercentBox
            name="TOU > APP"
            value={r.funnel.conversions.tou_app}
            target={r.targets?.funnel?.conversions?.tou_app}
            delta={r.deltas?.funnel?.conversions?.tou_app}
          />
          <FunnelPercentBox
            name="APP > EXE"
            value={r.funnel.conversions.app_exe}
            target={r.targets?.funnel?.conversions?.app_exe}
            delta={r.deltas?.funnel?.conversions?.app_exe}
          />
        </BoxColumn>

        <BoxColumn>
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
        </BoxColumn>
      </BoxRow>
    );
  };

  render() {
    return (
      <ReportSection name="Acquisition Funnel">
        <AcquisitionFunnelReport.HeadlineNumbers report={this.props.report} />
        <AcquisitionFunnelReport.FunnelTable
          header={<AcquisitionFunnelReport.FunnelHeader />}
          content={
            <AcquisitionFunnelReport.FunnelContent report={this.props.report} />
          }
        />
      </ReportSection>
    );
  }
}
