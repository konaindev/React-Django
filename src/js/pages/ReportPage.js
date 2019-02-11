import React, { Component } from "react";
import PropTypes from "prop-types";
import { VictoryChart, VictoryBar, VictoryTheme, Text } from "victory";

import Header from "../components/Header";
import {
  NavigationItems,
  ProjectNavigationItem,
  ReportNavigationItem
} from "../components/Navigation";

import {
  formatMultiple,
  formatPercent,
  formatNumber,
  formatCurrency,
  formatCurrencyShorthand,
  formatDate
} from "../utils/formatters";

/**
 * @description Wrap a value formatter to properly format "Target: " strings.
 *
 * @note If the underlying target value is null, we return an empty string.
 */
const targetFormatter = formatter => targetValue =>
  targetValue == null ? "" : `Target: ${formatter(targetValue)}`;

const formatTargetMultiple = targetFormatter(formatMultiple);
const formatTargetPercent = targetFormatter(formatPercent);
const formatTargetNumber = targetFormatter(formatNumber);
const formatTargetCurrency = targetFormatter(formatCurrency);
const formatTargetCurrencyShorthand = targetFormatter(formatCurrencyShorthand);
const formatTargetDate = targetFormatter(formatDate);

/**
 * @class LargeBoxLayout
 *
 * @classdesc A simple layout intended to emphasize a single metric. Uses large
 * text sizing, bright colors, and lots of white space.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class LargeBoxLayout extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    detail2: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="flex flex-col p-6 h-64 k-rectangle items-center text-center justify-center">
        {/* Container for the content itself.
            Counter-intuitively items- and text- center the rows and row content
            while justif- centers the rows vertically within the box. */}
        <span className="text-remark-ui-text-light text-base">
          {this.props.name}
        </span>
        <span className="text-remark-ui-text-lightest text-6xl font-hairline py-2">
          {this.props.content}
        </span>
        <span className="text-remark-ui-text text-sm">{this.props.detail}</span>
        <span className="text-remark-ui-text text-sm">
          {this.props.detail2}
        </span>
      </div>
    );
  }
}

/**
 * @class SmallBoxLayout
 *
 * @classdesc A simple layout intended to display a secondary metric. Uses
 * smaller text sizing, dimmer colors, and a little less white space.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class SmallBoxLayout extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="flex flex-row h-full py-8 k-rectangle">
        {/* Container for the content itself */}
        <div className="text-6xl w-1/3 flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline text-center">
            {this.props.content}
          </div>
        </div>
        {/* Container for the label and detail text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm">
            {this.props.detail}
          </span>
        </div>
      </div>
    );
  }
}

/**
 * @class FunnelBoxLayout
 *
 * @classdesc A simple layout intended to metrics in a funnel grid/table.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class FunnelBoxLayout extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="flex flex-row h-32 py-8 k-rectangle">
        {/* Container for the content itself */}
        <div className="text-6xl w-1/3 flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline text-center">
            {this.props.content}
          </div>
        </div>
        {/* Container for the label and detail text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm">
            {this.props.detail}
          </span>
        </div>
      </div>
    );
  }
}

/**
 * @description Wraps an arbitrary Box Component with desired formatting.
 *
 * @note This is where layout and semantics are tied together;
 * unless you have custom needs, you'll probably want to use one of the
 * *Box components defined using `withFormatter(...)`, below.
 */
const withFormatter = (WrappedComponent, formatter) => {
  const formatterForTarget = targetFormatter(formatter);

  return class extends React.Component {
    render() {
      let { value, target, ...remaining } = this.props;
      return (
        <WrappedComponent
          content={formatter(value)}
          detail={formatterForTarget(target)}
          {...remaining}
        />
      );
    }
  };
};

// Define LargeBoxLayoutes that take values and targets of various types.
const LargeMultipleBox = withFormatter(LargeBoxLayout, formatMultiple);
const LargePercentBox = withFormatter(LargeBoxLayout, formatPercent);
const LargeNumberBox = withFormatter(LargeBoxLayout, formatNumber);
const LargeCurrencyBox = withFormatter(LargeBoxLayout, formatCurrency);
const LargeCurrencyShorthandBox = withFormatter(
  LargeBoxLayout,
  formatCurrencyShorthand
);
const LargeDateBox = withFormatter(LargeBoxLayout, formatDate);

// Define SmallBoxLayoutes that take values and targets of various types.
const SmallMultipleBox = withFormatter(SmallBoxLayout, formatMultiple);
const SmallPercentBox = withFormatter(SmallBoxLayout, formatPercent);
const SmallNumberBox = withFormatter(SmallBoxLayout, formatNumber);
const SmallCurrencyBox = withFormatter(SmallBoxLayout, formatCurrency);
const SmallCurrencyShorthandBox = withFormatter(
  SmallBoxLayout,
  formatCurrencyShorthand
);
const SmallDateBox = withFormatter(SmallBoxLayout, formatDate);

// Define FunnelBoxLayoutes that take values and targets of various types.
const FunnelMultipleBox = withFormatter(FunnelBoxLayout, formatMultiple);
const FunnelPercentBox = withFormatter(FunnelBoxLayout, formatPercent);
const FunnelNumberBox = withFormatter(FunnelBoxLayout, formatNumber);
const FunnelCurrencyBox = withFormatter(FunnelBoxLayout, formatCurrency);
const FunnelCurrencyShorthandBox = withFormatter(
  FunnelBoxLayout,
  formatCurrencyShorthand
);
const FunnelDateBox = withFormatter(FunnelBoxLayout, formatDate);

/**
 * @description Utility to return a style object that partitions width into N.
 *
 * @note We simply divide the width into (100/n)% where n is the number
 * of partitions we would like. We use `toPrecision(...)` to match the
 * precision of tailwinds' `w-*` utility classes.
 */
const equalWidthStyle = partitions => ({
  width: `${(100.0 / partitions).toPrecision(7)}%`
});

/**
 * @class BoxRow
 *
 * @classdesc A simple layout for a single row of boxes. Pass boxes as `children`.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class BoxRow extends Component {
  static propTypes = {};

  render() {
    return (
      <div className="flex flex-row flex-grow items-stretch">
        {this.props.children.map((child, i) => (
          <div
            key={i}
            className="m-2"
            style={equalWidthStyle(this.props.children.length)}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
}

/**
 * @class StackedBox
 *
 * @classdesc A special-purpose layout placing a column of boxes downward.
 */
class StackedBox extends Component {
  static propTypes = {};

  render() {
    return (
      <>
        {this.props.children.map((child, i) => (
          <div key={i} className="flex flex-col">
            {child}
          </div>
        ))}
      </>
    );
  }
}

/**
 * @class BoxTable
 *
 * @classdesc A wrapper layout when multiple BoxRows are used.
 *
 * @note For now, this is a no-op that simply renders its children; in the
 * future, it could demand that each child is a `BoxRow` and wrap them
 * as desired.
 */
class BoxTable extends Component {
  render() {
    return <>{this.props.children}</>;
  }
}

/**
 * @class ReportSection
 *
 * @classdesc A named, grouped section of a report.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class ReportSection extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    bottomBoundary: PropTypes.bool
  };

  static defaultProps = {
    bottomBoundary: false
  };

  render() {
    const bottomBoundary = this.props.bottomBoundary ? (
      <hr className="k-divider m-0 pt-8 pb-4" />
    ) : null;

    return (
      <div className="p-8">
        <span className="text-remark-ui-text uppercase text-xs block mb-8">
          {this.props.name}
        </span>
        {this.props.children}
        {bottomBoundary}
      </div>
    );
  }
}

/**
 * @class LeasingPerformanceReport
 *
 * @classdesc Render the leasing performance section of a full `report`.
 */
class LeasingPerformanceReport extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  /**
   * @name LeasingPerformanceReport.HeadlineNumbers
   * @description Component that renders the most important leasing performance numbers.
   */
  static HeadlineNumbers = props => {
    const r = props.report;

    return (
      <BoxRow>
        <LargeBoxLayout
          name="Leased"
          content={formatPercent(r.leased_rate)}
          detail={`${formatNumber(
            r.leased_units
          )} Executed Leases (Out of ${formatNumber(r.occupiable_units)})`}
          detail2={formatTargetPercent(r.target_lease_percent)}
        />
        <LargeBoxLayout
          name="Retention"
          content={formatPercent(r.renewal_rate)}
          detail={`${formatNumber(
            r.lease_renewal_notices
          )} Notices to Renew (Out of ${r.leases_due_to_expire} Due To Expire)`}
          detail2={formatTargetPercent(r.target_renewal_rate)}
        />
        <LargeBoxLayout
          name="Occupied"
          content={formatPercent(r.occupancy_rate)}
          detail={`${formatNumber(
            r.occupied_units
          )} Occupied Units (Out of ${formatNumber(r.occupiable_units)})`}
          detail2={formatTargetPercent(r.target_occupancy_rate)}
        />
      </BoxRow>
    );
  };

  /**
   * @name LeasingPerformanceReport.DetailNumbers
   * @description Component that renders the secondary leasing performance numbers.
   */
  static DetailNumbers = props => {
    const r = props.report;
    return (
      <BoxTable>
        <BoxRow>
          <SmallNumberBox
            name="Lease Applications"
            value={r.lease_applications}
            target={r.target_lease_applications}
          />
          <SmallPercentBox
            name="Notices to Renew"
            value={r.lease_renewals}
            target={r.target_lease_renewals}
          />
          <SmallNumberBox
            name="Move Ins"
            value={r.move_ins}
            target={r.target_move_ins}
          />
        </BoxRow>
        <BoxRow>
          <SmallNumberBox
            name="Cancellations and Denials"
            value={r.lease_cds}
            target={r.target_lease_cds}
          />
          <SmallNumberBox
            name="Notices to Vacate"
            value={r.lease_vacation_notices}
            target={r.target_lease_vacation_notices}
          />
          <SmallNumberBox
            name="Move Outs"
            value={r.move_outs}
            detail={r.target_move_outs}
          />
        </BoxRow>
      </BoxTable>
    );
  };

  /**
   * @description Render the leasing performance report section
   */
  render() {
    return (
      <ReportSection name="Leasing Performance" bottomBoundary={true}>
        <LeasingPerformanceReport.HeadlineNumbers report={this.props.report} />
        <LeasingPerformanceReport.DetailNumbers report={this.props.report} />
      </ReportSection>
    );
  }
}

/**
 * @class CampaignInvestmentReportSection
 *
 * @classdesc A specialized layout for the more complex campaign investment
 * portion of the report.
 *
 * @note This is intended only to be a layout and should not concern itself
 * with values or semantics.
 */

/**
 * @class CampaignInvestmentReport
 *
 * @classdesc Renders all metrics and graphs related to investment
 */
class CampaignInvestmentReport extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  /**
   * @name CampaignInvestmentReport.HeadlineNumbers
   * @description Component that rendersheadline numbers for the investment report
   */
  static HeadlineNumbers = props => {
    const r = props.report;
    return (
      <BoxRow>
        <LargeCurrencyShorthandBox
          name="Campaign Investment"
          value={r.investment}
          target={r.target_investment}
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
  static InvestmentChart = props => {
    // gin up victoryjs style data from the raw props
    const data = [
      {
        category: "Reputation Building",
        investment: Number(props.reputation_building),
        color: "#4035f4"
      },
      {
        category: "Demand Creation",
        investment: Number(props.demand_creation),
        color: "#5147ff"
      },
      {
        category: "Leasing Enablement",
        investment: Number(props.leasing_enablement),
        color: "#867ffe"
      },
      {
        category: "Market Intelligence",
        investment: Number(props.market_intelligence),
        color: "#675efc"
      }
    ];

    // render the bar chart
    return (
      <ReportSection name={props.name} bottomBoundary={false}>
        <VictoryChart>
          <VictoryBar
            data={data}
            x="category"
            y="investment"
            style={{
              /* stylelint-disable */
              /* this is victory specific styling; stylelint is maybe right to complain */
              data: {
                fill: datum => datum.color
              },
              labels: {
                fill: "white"
              }
              /* stylelint-enable */
            }}
          />
        </VictoryChart>
      </ReportSection>
    );
  };

  /**
   * @name CampaignInvestmentReport.AcquisitionDetails
   * @description Component to render campaign acq_investment detail numbers
   */
  static AcquisitionDetails = props => {
    const r = props.report;
    return (
      <ReportSection name="Acquisition" bottomBoundary={false}>
        <BoxRow>
          <SmallNumberBox
            name="Leased Unit Change"
            value={r.delta_leases}
            target={r.target_delta_leases}
          />
          <SmallCurrencyShorthandBox
            name="Est. Acquired Leasing Revenue"
            value={r.estimated_acq_revenue_gain}
            target={r.target_estimated_acq_revenue_gain}
          />
        </BoxRow>
        <BoxRow>
          <SmallCurrencyShorthandBox
            name="Acquisition Investment"
            value={r.acq_investment}
            target={r.target_acq_investment}
          />
          <SmallMultipleBox
            name="Acquisition ROMI"
            value={r.acq_romi}
            target={r.target_acq_romi}
          />
        </BoxRow>
      </ReportSection>
    );
  };

  /**
   * @description Render acqusition report section.
   */
  static Acquisition = props => {
    const acqChartData = {
      reputation_building: props.report.acq_reputation_building,
      demand_creation: props.report.acq_demand_creation,
      leasing_enablement: props.report.acq_leasing_enablement,
      market_intelligence: props.report.acq_market_intelligence
    };

    return (
      <StackedBox>
        <CampaignInvestmentReport.AcquisitionDetails report={props.report} />
        <CampaignInvestmentReport.InvestmentChart
          name="Acquisition Investment Allocations"
          {...acqChartData}
        />
      </StackedBox>
    );
  };

  /**
   * @name CampaignInvestmentReport.RetentionDetails
   * @description Component to render campaign ret_investment detail numbers
   */
  static RetentionDetails = props => {
    const r = props.report;
    return (
      <ReportSection name="Retention" bottomBoundary={false}>
        <BoxRow>
          <SmallNumberBox
            name="Lease Renewals"
            value={r.lease_renewals}
            target={r.target_lease_renewals}
          />
          <SmallCurrencyShorthandBox
            name="Est. Retained Leasing Revenue"
            value={r.estimated_ret_revenue_gain}
            target={r.target_estimated_ret_revenue_gain}
          />
        </BoxRow>
        <BoxRow>
          <SmallCurrencyShorthandBox
            name="Retention Investment"
            value={r.ret_investment}
            target={r.target_ret_investment}
          />
          <SmallMultipleBox
            name="Retention ROMI"
            value={r.ret_romi}
            target={r.target_ret_romi}
          />
        </BoxRow>
      </ReportSection>
    );
  };

  /**
   * @name CampaignInvestmentReport.Retention
   * @description Component that renders the retention report section.
   */
  static Retention = props => {
    const retChartData = {
      reputation_building: props.report.ret_reputation_building,
      demand_creation: props.report.ret_demand_creation,
      leasing_enablement: props.report.ret_leasing_enablement,
      market_intelligence: props.report.ret_market_intelligence
    };

    return (
      <StackedBox>
        <CampaignInvestmentReport.RetentionDetails report={props.report} />
        <CampaignInvestmentReport.InvestmentChart
          name="Retention Investment Allocations"
          {...retChartData}
        />
      </StackedBox>
    );
  };

  /**
   * @description Render the campaign investment report section
   */
  render() {
    return (
      <ReportSection name="Campaign Investment" bottomBoundary={true}>
        <CampaignInvestmentReport.HeadlineNumbers report={this.props.report} />
        <BoxRow>
          <CampaignInvestmentReport.Acquisition report={this.props.report} />
          <CampaignInvestmentReport.Retention report={this.props.report} />
        </BoxRow>
      </ReportSection>
    );
  }
}

/**
 * @class AcqusitionFunnelReport
 *
 * @classdesc Render the acquisition funnel table
 */
class AcquisitionFunnelReport extends Component {
  render() {
    // TODO: this could really use some cleanup. -Dave
    const r = this.props.report;
    return (
      <ReportSection name="Acquisition Funnel" bottomBoundary={true}>
        {/* Headline numbers for the acquisition funnel. */}
        <div className="flex flex-row flex-grow items-stretch">
          <div className="w-1/3 m-2">
            <LargePercentBox
              name="USV > EXE"
              value={r.usv_exe_perc}
              target={r.target_usv_exe_perc}
            />
          </div>
          <div className="w-1/3 m-2">
            <LargePercentBox
              name="Cancellation & Denial Rate"
              value={r.lease_cd_rate}
              target={r.target_lease_cd_rate}
            />
          </div>
          <div className="w-1/3 m-2">
            <LargePercentBox
              name="Cost Per EXE / Average Monthly Rent"
              value={r.cost_per_exe_vs_monthly_average_rent}
              detail={r.target_cost_per_exe_vs_monthly_average_rent}
            />
          </div>
        </div>

        {/* Table: header column */}
        <div className="flex flex-row flex-grow items-stretch">
          <div className="w-1/6 flex flex-col">
            <div className="k-funnel-label">
              <div className="bg-remark-funnel-1">
                <div>Unique Site Visitors (USV)</div>
              </div>
              <div className="text-remark-funnel-2">↓</div>
            </div>
            <div className="k-funnel-label">
              <div className="bg-remark-funnel-2">
                <div>Inquiries (INQ)</div>
              </div>
              <div className="text-remark-funnel-3">↓</div>
            </div>
            <div className="k-funnel-label">
              <div className="bg-remark-funnel-3">
                <div>Tours (TOU)</div>
              </div>
              <div className="text-remark-funnel-4">↓</div>
            </div>
            <div className="k-funnel-label">
              <div className="bg-remark-funnel-4">
                <div>Lease Applications (APP)</div>
              </div>
              <div className="text-remark-funnel-5">↓</div>
            </div>
            <div className="k-funnel-label">
              <div className="bg-remark-funnel-5">
                <div>Lease Executions (EXE)</div>
              </div>
              <div>&nbsp;</div>
            </div>
          </div>

          {/* Table: container for all further columns */}
          <div className="w-5/6 flex flex-row flex-grow items-stretch">
            {/* Table: absolute numbers column */}
            <div className="w-1/3 flex flex-col items">
              <FunnelNumberBox
                name="Volume of USV"
                value={r.usvs}
                target={r.target_usvs}
              />
              <FunnelNumberBox
                name="Volume of INQ"
                value={r.inquiries}
                target={r.target_inquiries}
              />
              <FunnelNumberBox
                name="Volume of TOU"
                value={r.tours}
                target={r.target_tours}
              />
              <FunnelNumberBox
                name="Volume of APP"
                value={r.lease_applications}
                target={r.target_lease_applications}
              />
              <FunnelNumberBox
                name="Volume of EXE"
                value={r.leases_executed}
                target={r.target_leases_executed}
              />
            </div>

            {/* Table: percentages column */}

            <div className="w-1/3 flex flex-col">
              <FunnelPercentBox
                name="USV > INQ"
                value={r.usv_inq_perc}
                target={r.target_usv_inq_perc}
              />
              <FunnelPercentBox
                name="INQ > TOU"
                value={r.inq_tou_perc}
                target={r.target_inq_tou_perc}
              />
              <FunnelPercentBox
                name="TOU > APP"
                value={r.tou_app_perc}
                target={r.target_tou_app_perc}
              />
              <FunnelPercentBox
                name="APP > EXE"
                value={r.app_exe_perc}
                target={r.target_app_exe_perc}
              />
            </div>

            {/* Table: cost-pers column */}
            <div className="w-1/3 flex flex-col">
              <FunnelCurrencyBox
                name="Cost per USV"
                value={r.cost_per_usv}
                target={r.target_cost_per_usv}
              />
              <FunnelCurrencyBox
                name="Cost per INQ"
                value={r.cost_per_inq}
                target={r.target_cost_per_inq}
              />
              <FunnelCurrencyBox
                name="Cost per TOU"
                value={r.cost_per_tou}
                target={r.target_cost_per_tou}
              />
              <FunnelCurrencyBox
                name="Cost per APP"
                value={r.cost_per_app}
                target={r.target_cost_per_app}
              />
              <FunnelCurrencyBox
                name="Cost per EXE"
                value={r.cost_per_exe}
                target={r.target_cost_per_exe}
              />
            </div>
          </div>
        </div>
      </ReportSection>
    );
  }
}

/**
 * @class Report
 *
 * @classdesc Renders a full progress report from the underlying `report` data
 */
class Report extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  render() {
    return (
      <span>
        <LeasingPerformanceReport report={this.props.report} />
        <CampaignInvestmentReport report={this.props.report} />
        <AcquisitionFunnelReport report={this.props.report} />
      </span>
    );
  }
}

/**
 * @description Top-level project tabs
 */
class ProjectTabs extends Component {
  render() {
    return (
      <div className="k-tabs-container">
        <ul>
          <li className="selected">Performance</li>
          <li>Baseline</li>
          <li>Team</li>
        </ul>
        <hr className="k-divider k-pin-above-top" />
      </div>
    );
  }
}

/**
 * @description The full landing page for a single project report
 */
export default class ReportPage extends Component {
  // TODO further define the shape of a report and a project...
  static propTypes = {
    report: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  componentDidMount() {
    console.log("ReportPage props: ", this.props);
  }

  render() {
    const navigationItems = (
      <NavigationItems>
        <ProjectNavigationItem project={this.props.project} />
        <ReportNavigationItem report={this.props.report} />
      </NavigationItems>
    );

    return (
      <div className="page">
        <Header navigationItems={navigationItems}>
          <>
            <ProjectTabs />
            <Report report={this.props.report} />
          </>
        </Header>
      </div>
    );
  }
}
