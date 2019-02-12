import React, { Component } from "react";
import PropTypes from "prop-types";
import { VictoryChart, VictoryBar, VictoryAxis } from "victory";

import { remarkablyChartTheme } from "../utils/victoryTheme";

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

//
// TODO
//
// At this point, I think we're far enough along that we could break this out
// into a bunch of files and arrive at a happier place.
//
// Some of these top-level components, and even some of their subcomponents,
// are probably pretty generic; others really are specific to the progress
// report. -Dave
//

/**
 * @description Wrap a value formatter to properly format "Target: " strings.
 *
 * @note If the underlying target value is null, we return an empty string.
 */
const targetFormatter = formatter => targetValue =>
  targetValue == null ? (
    <span>&nbsp;</span>
  ) : (
    `Target: ${formatter(targetValue)}`
  );

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
        <span className="text-remark-ui-text-lightest font-mono text-6xl font-hairline py-2">
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
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="flex flex-row h-full my-4 py-6 k-rectangle">
        {/* Container for the label and detail text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base pl-8">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm pl-8 mt-2">
            {this.props.detail}
          </span>
        </div>
        {/* Container for the content itself */}
        <div className="text-5xl w-1/2 flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline font-mono text-right pr-8">
            {this.props.content}
          </div>
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
      <div className="flex flex-row h-24 my-2 py-6 k-rectangle">
        {/* Container for the label and detail text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base pl-8">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm pl-8">
            {this.props.detail}
          </span>
        </div>
        {/* Container for the content itself */}
        <div className="text-4xl w-1/2 flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline font-mono text-right pr-8">
            {this.props.content}
          </div>
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

// Define LargeBoxLayouts that take values and targets of various types.
const LargeMultipleBox = withFormatter(LargeBoxLayout, formatMultiple);
const LargePercentBox = withFormatter(LargeBoxLayout, formatPercent);
const LargeNumberBox = withFormatter(LargeBoxLayout, formatNumber);
const LargeCurrencyBox = withFormatter(LargeBoxLayout, formatCurrency);
const LargeCurrencyShorthandBox = withFormatter(
  LargeBoxLayout,
  formatCurrencyShorthand
);
const LargeDateBox = withFormatter(LargeBoxLayout, formatDate);

// Define SmallBoxLayouts that take values and targets of various types.
const SmallMultipleBox = withFormatter(SmallBoxLayout, formatMultiple);
const SmallPercentBox = withFormatter(SmallBoxLayout, formatPercent);
const SmallNumberBox = withFormatter(SmallBoxLayout, formatNumber);
const SmallCurrencyBox = withFormatter(SmallBoxLayout, formatCurrency);
const SmallCurrencyShorthandBox = withFormatter(
  SmallBoxLayout,
  formatCurrencyShorthand
);
const SmallDateBox = withFormatter(SmallBoxLayout, formatDate);

// Define FunnelBoxLayouts that take values and targets of various types.
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
  static propTypes = { externalMargin: PropTypes.bool.isRequired };

  static defaultProps = { externalMargin: true };

  render() {
    const baseClassNames = "flex flex-row flex-grow items-stretch";
    const classNames = this.props.externalMargin
      ? `${baseClassNames} -m-4`
      : baseClassNames;

    return (
      <div className={classNames}>
        {this.props.children.map((child, i) => (
          <div
            key={i}
            className="m-4"
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
 * @class BoxColumn
 *
 * @classdesc A special-purpose layout placing a column of boxes downward.
 */
class BoxColumn extends Component {
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
    horizontalPadding: PropTypes.bool.isRequired
  };

  static defaultProps = {
    horizontalPadding: true
  };

  render() {
    const className = this.props.horizontalPadding ? "p-8" : "py-8";

    return (
      <div className={className}>
        <span className="mx-4 text-remark-ui-text uppercase block tracking-wide">
          {this.props.name}
        </span>
        <hr className="k-divider mt-8 mb-12 mx-0" />
        {this.props.children}
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
          <BoxColumn>
            <SmallNumberBox
              name="Lease Applications"
              value={r.lease_applications}
              target={r.target_lease_applications}
            />
            <SmallNumberBox
              name="Cancellations and Denials"
              value={r.lease_cds}
              target={r.target_lease_cds}
            />
          </BoxColumn>
          <BoxColumn>
            <SmallPercentBox
              name="Notices to Renew"
              value={r.lease_renewals}
              target={r.target_lease_renewals}
            />
            <SmallNumberBox
              name="Notices to Vacate"
              value={r.lease_vacation_notices}
              target={r.target_lease_vacation_notices}
            />
          </BoxColumn>
          <BoxColumn>
            <SmallNumberBox
              name="Move Ins"
              value={r.move_ins}
              target={r.target_move_ins}
            />
            <SmallNumberBox
              name="Move Outs"
              value={r.move_outs}
              target={r.target_move_outs}
            />
          </BoxColumn>
        </BoxRow>
      </BoxTable>
    );
  };

  /**
   * @description Render the leasing performance report section
   */
  render() {
    return (
      <ReportSection name="Leasing Performance">
        <LeasingPerformanceReport.HeadlineNumbers report={this.props.report} />
        <LeasingPerformanceReport.DetailNumbers report={this.props.report} />
      </ReportSection>
    );
  }
}

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
    const div_or_0 = (a, b) => {
      const a_num = Number(a);
      const b_num = Number(b);
      return b_num == 0 ? 0 : a_num / b_num;
    };
    // gin up victoryjs style data from the raw props
    const data = [
      {
        category: "Reputation Building",
        investment: formatCurrencyShorthand(props.reputation_building),
        percent: div_or_0(props.reputation_building, props.investment),
        color: "#4035f4"
      },
      {
        category: "Demand Creation",
        investment: formatCurrencyShorthand(props.demand_creation),
        percent: div_or_0(props.demand_creation, props.investment),
        color: "#5147ff"
      },
      {
        category: "Leasing Enablement",
        investment: formatCurrencyShorthand(props.leasing_enablement),
        percent: div_or_0(props.leasing_enablement, props.investment),
        color: "#867ffe"
      },
      {
        category: "Market Intelligence",
        investment: formatCurrencyShorthand(props.market_intelligence),
        percent: div_or_0(props.market_intelligence, props.investment),
        color: "#675efc"
      }
    ];

    console.log(data);

    // render the bar chart
    return (
      <ReportSection name={props.name} horizontalPadding={false}>
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
  static AcquisitionDetails = props => {
    const r = props.report;
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
  static Acquisition = props => {
    const acqChartData = {
      investment: props.report.acq_investment,
      reputation_building: props.report.acq_reputation_building,
      demand_creation: props.report.acq_demand_creation,
      leasing_enablement: props.report.acq_leasing_enablement,
      market_intelligence: props.report.acq_market_intelligence
    };

    return (
      <BoxColumn>
        <CampaignInvestmentReport.AcquisitionDetails report={props.report} />
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
  static RetentionDetails = props => {
    const r = props.report;
    return (
      <ReportSection name="Retention" horizontalPadding={false}>
        <SmallNumberBox
          name="Lease Renewals"
          value={r.lease_renewals}
          target={r.target_lease_renewals}
        />
        <SmallCurrencyShorthandBox
          name="Retention Investment"
          value={r.ret_investment}
          target={r.target_ret_investment}
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
  static Retention = props => {
    const retChartData = {
      investment: props.report.ret_investment,
      reputation_building: props.report.ret_reputation_building,
      demand_creation: props.report.ret_demand_creation,
      leasing_enablement: props.report.ret_leasing_enablement,
      market_intelligence: props.report.ret_market_intelligence
    };

    return (
      <BoxColumn>
        <CampaignInvestmentReport.RetentionDetails report={props.report} />
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

/**
 * @class AcqusitionFunnelReport
 *
 * @classdesc Render the acquisition funnel table
 */
class AcquisitionFunnelReport extends Component {
  /**
   * @name AcquisitionFunnelReport.HeadlineNumbers
   * @description Component that renders headline acquisition funnel numbers
   */
  static HeadlineNumbers = props => {
    const r = props.report;

    return (
      <BoxRow>
        <LargePercentBox
          name="USV > EXE"
          value={r.usv_exe_perc}
          target={r.target_usv_exe_perc}
        />
        <LargePercentBox
          name="Cancellation & Denial Rate"
          value={r.lease_cd_rate}
          target={r.target_lease_cd_rate}
        />
        <LargePercentBox
          name="Cost Per EXE / Average Monthly Rent"
          value={r.cost_per_exe_vs_monthly_average_rent}
          detail={r.target_cost_per_exe_vs_monthly_average_rent}
        />
      </BoxRow>
    );
  };

  /**
   * @name AcquisitionFunnelReport.FunnelTable
   * @description Component that lays out the table header and content columns
   */
  static FunnelTable = props => {
    return (
      <div className="flex flex-row flex-grow items-stretch">
        <div className="w-1/6">{props.header}</div>
        <div className="w-5/6 flex flex-row flex-grow items-stretch">
          {props.content}
        </div>
      </div>
    );
  };

  static FunnelHeaderBox = props => {
    return (
      <div className="k-funnel-label">
        <div className={`bg-remark-funnel-${props.number}`}>
          <div>{props.name}</div>
        </div>
        <div className={`text-remark-funnel-${props.number + 1}`}>
          {props.more ? "↓" : <span>&nbsp;</span>}
        </div>
      </div>
    );
  };

  static FunnelHeader = props => {
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

  static FunnelContent = props => {
    const r = props.report;
    return (
      <BoxRow externalMargin={false}>
        <BoxColumn>
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
        </BoxColumn>

        <BoxColumn>
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
        </BoxColumn>

        <BoxColumn>
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
    console.log("Report data", this.props.report);
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
