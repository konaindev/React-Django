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
          infoTooltip="est_revenue_change"
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
          infoTooltip="campaign_return_on_marketing_investment"
          value={r.investment.total.romi}
          target={r.targets?.investment?.total?.romi}
          symbolType="multiple"
          tooltip={romi_tooltip(r.investment.total)}
        />
      </BoxRow>
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
