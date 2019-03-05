import React, { Component } from "react";
import PropTypes from "prop-types";

import BoxRow from "../box_row";
import BoxColumn from "../box_column";
import ReportSection from "../report_section";
import Panel from "../panel";
import PercentageGraphBox from "../percentage_graph_box";
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
        <PercentageGraphBox
          name="USV > EXE"
          value={r.funnel.conversions.usv_exe}
          target={r.targets?.funnel?.conversions?.usv_exe}
          delta={r.deltas?.funnel?.conversions?.usv_exe}
          series={r.whiskers?.usv_exe}
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
    return (
      <div className="acquisition-funnel__table">
        {children}
      </div>
    );
  };

  static FunnelColumn = ({ children }) => (
    <div className="acquisition-funnel__column">
      <Panel className="acquisition-funnel__column-inner">
        {children}
      </Panel>
    </div>
  );

  static FunnelRow = ({ children }) => (
    <div className="acquisition-funnel__row">
      {children}
    </div>
  );

  static FunnelColumnHeader = ({ name }) => (
    <div className="acquisition-funnel__column-header">
      {name}
    </div>
  );

  static FunnelColumnContent = ({ children }) => (
    <div className="acquisition-funnel__column-content">
      {children}
    </div>
  )

  static FunnelContent = ({ report: r }) => {
    return (
      <AcquisitionFunnelReport.FunnelRow>
        <AcquisitionFunnelReport.FunnelColumn>
          <AcquisitionFunnelReport.FunnelColumnHeader name="Volume of Activity" />
          <AcquisitionFunnelReport.FunnelColumnContent>
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
    const { report } = this.props;

    return (
      <ReportSection name="Acquisition Funnel">
        <AcquisitionFunnelReport.HeadlineNumbers report={report} />
        <AcquisitionFunnelReport.FunnelTable>
          <AcquisitionFunnelReport.FunnelContent report={report} />
        </AcquisitionFunnelReport.FunnelTable>
      </ReportSection>
    );
  }
}
