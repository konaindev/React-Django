import _isNil from "lodash/isNil";
import React, { Component } from "react";
import PropTypes from "prop-types";

import InvestmentAllocation from "../investment_allocation";
import { LargeCurrencyShorthandBox, LargeNumberBox } from "../large_box_layout";
import BoxRow from "../box_row";
import BoxColumn from "../box_column";
import ReportSection from "../report_section";
import { SmallNumberBox, SmallCurrencyShorthandBox } from "../small_box_layout";
import {
  formatCurrencyShorthand,
  formatCurrencyShorthandWithDigit
} from "../../utils/formatters.js";
import { CurrencyShorthandGraphBox } from "../large_graph_box";

import "./campaign_investment_report.scss";

const getYMax = val => {
  let unit = Math.pow(10, parseInt(Math.log10(val), 10));
  let slope = val / unit;
  if (val / unit > 5) {
    unit *= 2;
    slope /= 2;
  }
  return unit * Math.ceil(slope);
};

const romi_tooltip = obj => {
  const numerator = formatCurrencyShorthand(obj.estimated_revenue_gain, true);
  const denominator = formatCurrencyShorthand(obj.total, true);
  return `${numerator} / ${denominator}`;
};

const formatFourWeekAverages = value => {
  if (_isNil(value)) {
    return;
  }
  const curValue = formatCurrencyShorthandWithDigit(value);
  return `4-Week Average: ${curValue}`;
};

/**
 * @class CampaignInvestmentReport
 *
 * @classdesc Renders all metrics and graphs related to investment
 */
export default class CampaignInvestmentReport extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  /**
   * @name CampaignInvestmentReport.HeadlineNumbers
   * @description Component that rendersheadline numbers for the investment report
   */
  static HeadlineNumbers = ({ report: r }) => {
    return (
      <BoxRow>
        <CurrencyShorthandGraphBox
          name="Campaign Investment"
          value={r.investment.total.total}
          extraContent={formatFourWeekAverages(
            r.four_week_funnel_averages?.investment
          )}
          target={r.targets?.investment?.total?.total}
          delta={r.deltas?.investment?.total?.total}
          series={r.whiskers?.investment}
        />
        <LargeCurrencyShorthandBox
          name="Est. Revenue Change"
          value={r.investment.total.estimated_revenue_gain}
          target={r.targets?.investment?.total?.estimated_revenue_gain}
          symbolType="sign"
        />
        <LargeNumberBox
          name={
            <>
              Campaign Return on <br />
              Marketing Investment (ROMI)
            </>
          }
          value={r.investment.total.romi}
          target={r.targets?.investment?.total?.romi}
          symbolType="multiple"
          tooltip={romi_tooltip(r.investment.total)}
        />
      </BoxRow>
    );
  };

  /**
   * @name CampaignInvestmentReport.RetentionDetails
   * @description Component to render campaign ret_investment detail numbers
   */
  static RetentionDetails = ({ report: r }) => {
    return (
      <ReportSection name="Retention">
        <SmallNumberBox
          name="Lease Renewals"
          value={r.property.leasing.renewals}
          target={r.targets?.property?.leasing?.renewals}
          delta={r.deltas?.property?.leasing?.renewals}
        />
        <SmallCurrencyShorthandBox
          name="Retention Investment"
          value={r.investment.retention.total}
          detail2={formatFourWeekAverages(
            r.four_week_funnel_averages?.ret_investment
          )}
          target={r.targets?.investment?.retention?.total}
          delta={r.deltas?.investment?.retention?.total}
        />
        <SmallCurrencyShorthandBox
          name="Est. Retained Leasing Revenue"
          value={r.investment.retention.estimated_revenue_gain}
          target={r.targets?.investment?.retention?.estimated_revenue_gain}
          symbolType="sign"
        />
        <SmallNumberBox
          name="Retention ROMI"
          value={r.investment.retention.romi}
          target={r.targets?.investment?.retention?.romi}
          symbolType="multiple"
          tooltip={romi_tooltip(r.investment.retention)}
        />
      </ReportSection>
    );
  };

  /**
   * @name CampaignInvestmentReport.Retention
   * @description Component that renders the retention report section.
   */
  static Retention = ({ report: r }) => {
    const retChartData = getRetentionChartData(r);

    return (
      <BoxColumn>
        <CampaignInvestmentReport.RetentionDetails report={r} />
        <CampaignInvestmentReport.InvestmentChart
          name="Retention Investment Allocations"
          {...retChartData}
        />
      </BoxColumn>
    );
  };

  /**
   * @description Render the campaign investment report section
   */
  render() {
    return (
      <ReportSection
        className="campaign-investment-report"
        name="Campaign Investment"
      >
        <CampaignInvestmentReport.HeadlineNumbers report={this.props.report} />
        <InvestmentAllocation
          retention={this.props.report?.investment?.retention}
          acquisition={this.props.report?.investment?.acquisition}
          report={this.props.report}
        />
      </ReportSection>
    );
  }
}
