import React, { Component } from "react";
import PropTypes from "prop-types";

import { VictoryChart, VictoryBar, VictoryArea, VictoryAxis } from "victory";

import { LargeCurrencyShorthandBox, LargeNumberBox } from "../large_box_layout";
import BoxRow from "../box_row";
import BoxColumn from "../box_column";
import Panel from "../panel";
import ReportSection from "../report_section";
import {
  SmallNumberBox,
  SmallCurrencyShorthandBox,
  SmallMultipleBox
} from "../small_box_layout";
import WhiskerPlot from "../whisker_plot";
import {
  formatCurrencyShorthand,
  formatPercent
} from "../../utils/formatters.js";
import { remarkablyChartTheme } from "../../utils/victoryTheme.js";
import { CurrencyShorthandGraphBox } from "../large_graph_box";

import "./campaign_investment_report.scss";

const CIR_GREEN1 = "#338100";
const CIR_GREEN2 = "#41C100";
const CIR_GREEN3 = "#BCFBF1";
const CIR_GREEN4 = "#53F7DD";

const getAquisitionChartBasicData = r => ({
  reputation_building: r.investment.acquisition.expenses.reputation_building,
  demand_creation: r.investment.acquisition.expenses.demand_creation,
  leasing_enablement: r.investment.acquisition.expenses.leasing_enablement,
  market_intelligence: r.investment.acquisition.expenses.market_intelligence
});

const getRetentionChartBasicData = r => ({
  reputation_building: r.investment.retention.expenses.reputation_building,
  demand_creation: r.investment.retention.expenses.demand_creation,
  leasing_enablement: r.investment.retention.expenses.leasing_enablement,
  market_intelligence: r.investment.retention.expenses.market_intelligence
});

const getYMax = val => {
  let unit = Math.pow(10, parseInt(Math.log10(val), 10));
  let slope = val / unit;
  if (val / unit > 5) {
    unit *= 2;
    slope /= 2;
  }
  return unit * Math.ceil(slope);
};

const getAquisitionChartData = r => {
  const data = getAquisitionChartBasicData(r);
  return {
    ...data,
    yMax: getYMax(
      Math.max(
        ...[
          ...Object.values(data),
          ...Object.values(getRetentionChartBasicData(r))
        ]
      )
    ),
    investment: r.investment.acquisition.total
  };
};

const getRetentionChartData = r => {
  const data = getRetentionChartBasicData(r);
  return {
    ...data,
    yMax: getYMax(
      Math.max(
        ...[
          ...Object.values(data),
          ...Object.values(getAquisitionChartBasicData(r))
        ]
      )
    ),
    investment: r.investment.retention.total
  };
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
        />
      </BoxRow>
    );
  };

  /**
   * @name CampaignInvestmentReport.InvestmentChart
   * @description Component that renders a single investment breakdown bar chart
   */
  static InvestmentChart = ({
    name,
    yMax,
    reputation_building,
    demand_creation,
    leasing_enablement,
    market_intelligence,
    investment
  }) => {
    const div_or_0 = (a, b) => {
      const a_num = Number(a);
      const b_num = Number(b);
      return b_num == 0 ? 0 : a_num / b_num;
    };

    // gin up victoryjs style data from the raw props
    const data = [
      {
        category: "Reputation\nBuilding",
        investment: Number(reputation_building),
        percent: div_or_0(reputation_building, investment),
        color: CIR_GREEN1
      },
      {
        category: "Demand\nCreation",
        investment: Number(demand_creation),
        percent: div_or_0(demand_creation, investment),
        color: CIR_GREEN2
      },
      {
        category: "Leasing\nEnablement",
        investment: Number(leasing_enablement),
        percent: div_or_0(leasing_enablement, investment),
        color: CIR_GREEN3
      },
      {
        category: "Market\nIntelligence",
        investment: Number(market_intelligence),
        percent: div_or_0(market_intelligence, investment),
        color: CIR_GREEN4
      }
    ];

    // render the bar chart
    return (
      <ReportSection name={name}>
        <Panel className="bar-chart panel-rounded-rect">
          <VictoryChart
            theme={remarkablyChartTheme}
            domain={{ y: [0, yMax] }}
            domainPadding={{ x: 14 }}
          >
            <VictoryAxis
              dependentAxis
              orientation="left"
              tickCount={5}
              tickFormat={t => formatCurrencyShorthand(t)}
            />
            <VictoryAxis orientation="bottom" />
            <VictoryBar
              data={data}
              x="category"
              y="investment"
              labels={d => formatCurrencyShorthand(d.investment)}
              style={{
                data: {
                  fill: datum => datum.color
                }
              }}
            />
          </VictoryChart>
        </Panel>
      </ReportSection>
    );
  };

  /**
   * @name CampaignInvestmentReport.AcquisitionDetails
   * @description Component to render campaign acq_investment detail numbers
   */
  static AcquisitionDetails = ({ report: r }) => {
    return (
      <ReportSection name="Acquisition">
        <SmallNumberBox
          name="Leased Unit Change"
          value={r.property.leasing.change}
          target={r.targets?.property?.leasing?.change}
          symbolType="sign"
        />
        <SmallCurrencyShorthandBox
          name="Acquisition Investment"
          value={r.investment.acquisition.total}
          target={r.targets?.investment?.acquisition?.total}
          delta={r.deltas?.investment?.acquisition?.total}
        />
        <SmallCurrencyShorthandBox
          name="Est. Acquired Leasing Revenue"
          value={r.investment.acquisition.estimated_revenue_gain}
          target={r.targets?.investment?.acquisition?.estimated_revenue_gain}
          symbolType="sign"
        />
        <SmallNumberBox
          name="Acquisition ROMI"
          value={r.investment.acquisition.romi}
          target={r.targets?.investment?.acquisition?.romi}
          symbolType="multiple"
        />
      </ReportSection>
    );
  };

  /**
   * @description Render acqusition report section.
   */
  static Acquisition = ({ report: r }) => {
    const acqChartData = getAquisitionChartData(r);
    const retChartData = getRetentionChartData(r);

    return (
      <BoxColumn>
        <CampaignInvestmentReport.AcquisitionDetails report={r} />
        <CampaignInvestmentReport.InvestmentChart
          name="Acquisition Investment Allocations"
          {...acqChartData}
        />
      </BoxColumn>
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
        <BoxRow>
          <CampaignInvestmentReport.Acquisition report={this.props.report} />
          <CampaignInvestmentReport.Retention report={this.props.report} />
        </BoxRow>
      </ReportSection>
    );
  }
}
