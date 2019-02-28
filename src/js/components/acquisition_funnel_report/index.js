import React, { Component } from "react";
import PropTypes from "prop-types";

import BoxRow from "../box_row";
import BoxColumn from "../box_column";
import ReportSection from "../report_section";
import WhiskerPlot from "../whisker_plot";
import { LargeDetailPercentBox, LargePercentBox } from "../large_box_layout";

import {
  FunnelNumberBox,
  FunnelPercentBox,
  FunnelCurrencyBox
} from "../funnel_box_layout";

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
          value={r.usv_exe_perc}
          target={r.target_usv_exe_perc}
          delta={r.delta_usv_exe_perc}
          innerBox={WhiskerPlot.maybe(r.whiskers.usv_exe_perc)}
        />
        <LargePercentBox
          name="Cancellation & Denial Rate"
          value={r.lease_cd_rate}
          target={r.target_lease_cd_rate}
          delta={r.delta_lease_cd_rate}
          innerBox={WhiskerPlot.maybe(r.whiskers.lease_cd_rate)}
        />
        {/* we reverse the arrow here because declining percentages are *good* */}
        <LargePercentBox
          name="Cost Per EXE / Average Monthly Rent"
          value={r.cost_per_exe_vs_monthly_average_rent}
          detail={r.target_cost_per_exe_vs_monthly_average_rent}
          delta={r.delta_cost_per_exe_vs_monthly_average_rent}
          innerBox={WhiskerPlot.maybe(
            r.whiskers.cost_per_exe_vs_monthly_average_rent
          )}
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
            value={r.usvs}
            target={r.target_usvs}
            delta={r.delta_usvs}
          />
          <FunnelNumberBox
            name="Volume of INQ"
            value={r.inquiries}
            target={r.target_inquiries}
            delta={r.delta_inquiries}
          />
          <FunnelNumberBox
            name="Volume of TOU"
            value={r.tours}
            target={r.target_tours}
            delta={r.delta_tours}
          />
          <FunnelNumberBox
            name="Volume of APP"
            value={r.lease_applications}
            target={r.target_lease_applications}
            delta={r.delta_lease_applications}
          />
          <FunnelNumberBox
            name="Volume of EXE"
            value={r.leases_executed}
            target={r.target_leases_executed}
            delta={r.delta_leases_executed}
          />
        </BoxColumn>

        <BoxColumn>
          <FunnelPercentBox
            name="USV > INQ"
            value={r.usv_inq_perc}
            target={r.target_usv_inq_perc}
            delta={r.delta_usv_inq_perc}
          />
          <FunnelPercentBox
            name="INQ > TOU"
            value={r.inq_tou_perc}
            target={r.target_inq_tou_perc}
            delta={r.delta_inq_tou_perc}
          />
          <FunnelPercentBox
            name="TOU > APP"
            value={r.tou_app_perc}
            target={r.target_tou_app_perc}
            delta={r.delta_tou_app_perc}
          />
          <FunnelPercentBox
            name="APP > EXE"
            value={r.app_exe_perc}
            target={r.target_app_exe_perc}
            delta={r.delta_app_exe_perc}
          />
        </BoxColumn>

        <BoxColumn>
          <FunnelCurrencyBox
            name="Cost per USV"
            value={r.cost_per_usv}
            target={r.target_cost_per_usv}
            delta={r.delta_cost_per_usv}
          />
          <FunnelCurrencyBox
            name="Cost per INQ"
            value={r.cost_per_inq}
            target={r.target_cost_per_inq}
            delta={r.delta_cost_per_inq}
          />
          <FunnelCurrencyBox
            name="Cost per TOU"
            value={r.cost_per_tou}
            target={r.target_cost_per_tou}
            delta={r.delta_cost_per_tou}
          />
          <FunnelCurrencyBox
            name="Cost per APP"
            value={r.cost_per_app}
            target={r.target_cost_per_app}
            delta={r.delta_cost_per_app}
          />
          <FunnelCurrencyBox
            name="Cost per EXE"
            value={r.cost_per_exe}
            target={r.target_cost_per_exe}
            delta={r.delta_cost_per_exe}
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
