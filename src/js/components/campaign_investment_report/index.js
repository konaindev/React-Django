import React from "react";
import PropTypes from "prop-types";

import {
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryArea,
  VictoryAxis
} from "victory";

import {
  LargeCurrencyShorthandBox,
  LargeMultipleBox
} from '../large_box_layout';
import BoxRow from '../box_row';
import ReportSection from '../report_section';
import {
  SmallNumberBox,
  SmallCurrencyShorthandBox,
  SmallMultipleBox
} from '../small_box_layout';


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
        <LargeCurrencyShorthandBox
          name="Campaign Investment"
          value={r.investment}
          target={r.target_investment}
          delta={r.delta_investment}
          innerBox={WhiskerPlot.maybe(r.whiskers.investment)}
        />
        <LargeCurrencyShorthandBox
          name="Est. Revenue Change"
          value={r.estimated_revenue_gain}
          target={r.target_estimated_revenue_gain}
        />
        <LargeMultipleBox
          name="Campaign Return on Marketing Investment (ROMI)"
          value={r.romi}
          target={r.target_romi}
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
        category: "Reputation Building",
        investment: formatCurrencyShorthand(reputation_building),
        percent: div_or_0(reputation_building, investment),
        color: "#4035f4"
      },
      {
        category: "Demand Creation",
        investment: formatCurrencyShorthand(demand_creation),
        percent: div_or_0(demand_creation, investment),
        color: "#5147ff"
      },
      {
        category: "Leasing Enablement",
        investment: formatCurrencyShorthand(leasing_enablement),
        percent: div_or_0(leasing_enablement, investment),
        color: "#867ffe"
      },
      {
        category: "Market Intelligence",
        investment: formatCurrencyShorthand(market_intelligence),
        percent: div_or_0(market_intelligence, investment),
        color: "#675efc"
      }
    ];

    // render the bar chart
    return (
      <ReportSection name={name} horizontalPadding={false}>
        <div className="k-rectangle p-4">
          <VictoryChart
            theme={remarkablyChartTheme}
            domain={{ y: [0, 1] }}
            domainPadding={{ x: 14 }}
          >
            <VictoryAxis
              dependentAxis
              orientation="left"
              tickFormat={t => formatPercent(t)}
            />
            <VictoryAxis orientation="bottom" />
            <VictoryBar
              data={data}
              x="category"
              y="percent"
              labels={d => d.investment}
              style={{
                data: {
                  fill: datum => datum.color
                }
              }}
            />
          </VictoryChart>
        </div>
      </ReportSection>
    );
  };

  /**
   * @name CampaignInvestmentReport.AcquisitionDetails
   * @description Component to render campaign acq_investment detail numbers
   */
  static AcquisitionDetails = ({ report: r }) => {
    return (
      <ReportSection name="Acquisition" horizontalPadding={false}>
        <SmallNumberBox
          name="Leased Unit Change"
          value={r.delta_leases}
          target={r.target_delta_leases}
        />
        <SmallCurrencyShorthandBox
          name="Acquisition Investment"
          value={r.acq_investment}
          target={r.target_acq_investment}
          delta={r.delta_acq_investment}
        />
        <SmallCurrencyShorthandBox
          name="Est. Acquired Leasing Revenue"
          value={r.estimated_acq_revenue_gain}
          target={r.target_estimated_acq_revenue_gain}
        />
        <SmallMultipleBox
          name="Acquisition ROMI"
          value={r.acq_romi}
          target={r.target_acq_romi}
        />
      </ReportSection>
    );
  };

  /**
   * @description Render acqusition report section.
   */
  static Acquisition = ({ report: r }) => {
    const acqChartData = {
      investment: r.acq_investment,
      reputation_building: r.acq_reputation_building,
      demand_creation: r.acq_demand_creation,
      leasing_enablement: r.acq_leasing_enablement,
      market_intelligence: r.acq_market_intelligence
    };

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
      <ReportSection name="Retention" horizontalPadding={false}>
        <SmallNumberBox
          name="Lease Renewals"
          value={r.lease_renewals}
          target={r.target_lease_renewals}
          delta={r.delta_lease_renewals}
        />
        <SmallCurrencyShorthandBox
          name="Retention Investment"
          value={r.ret_investment}
          target={r.target_ret_investment}
          delta={r.delta_ret_investment}
        />
        <SmallCurrencyShorthandBox
          name="Est. Retained Leasing Revenue"
          value={r.estimated_ret_revenue_gain}
          target={r.target_estimated_ret_revenue_gain}
        />
        <SmallMultipleBox
          name="Retention ROMI"
          value={r.ret_romi}
          target={r.target_ret_romi}
        />
      </ReportSection>
    );
  };

  /**
   * @name CampaignInvestmentReport.Retention
   * @description Component that renders the retention report section.
   */
  static Retention = ({ report: r }) => {
    const retChartData = {
      investment: r.ret_investment,
      reputation_building: r.ret_reputation_building,
      demand_creation: r.ret_demand_creation,
      leasing_enablement: r.ret_leasing_enablement,
      market_intelligence: r.ret_market_intelligence
    };

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
      <ReportSection name="Campaign Investment">
        <CampaignInvestmentReport.HeadlineNumbers report={this.props.report} />
        <BoxRow>
          <CampaignInvestmentReport.Acquisition report={this.props.report} />
          <CampaignInvestmentReport.Retention report={this.props.report} />
        </BoxRow>
      </ReportSection>
    );
  }
}
