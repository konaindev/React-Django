import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  VictoryChart,
  VictoryBar,
  VictoryGroup,
  VictoryArea,
  VictoryAxis
} from "victory";

import { remarkablyChartTheme } from "../utils/victoryTheme";

import Header from "../components/Header";
import {
  NavigationItems,
  ProjectNavigationItem
} from "../components/Navigation";

import {
  formatMultiple,
  formatPercent,
  formatNumber,
  formatCurrency,
  formatCurrencyShorthand,
  formatDate,
  formatDeltaPercent
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

const formatTargetPercent = targetFormatter(formatPercent);

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
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    detail2: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    innerBox: PropTypes.element
  };

  renderInnerBox() {
    return this.props.innerBox ? (
      <div className="w-48 h-48 bg-transparent overflow-hidden">
        {this.props.innerBox}
      </div>
    ) : (
      <></>
    );
  }

  render() {
    return (
      <div className="flex flex-col p-6 h-64 k-rectangle items-center text-center justify-center">
        {/* Container for the content itself.
            Counter-intuitively items- and text- center the rows and row content
            while justif- centers the rows vertically within the box. */}
        <span className="text-remark-ui-text-light text-base">
          {this.props.name}
        </span>
        <div className="flex items-center text-center justify-center">
          <span className="text-remark-ui-text-lightest font-mono text-6xl font-hairline py-2 w-full">
            {this.props.content}
          </span>
          {this.renderInnerBox()}
        </div>
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
        <div className="text-5xl flex flex-col leading-compressed justify-center content-center">
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
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
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
        <div className="text-4xl flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline font-mono text-right pr-8">
            {this.props.content}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * @class DeltaLayout
 *
 * @classdesc Lays out a value and its delta, including primary, arrow, and colors.
 *
 * @note This provides layout only; it is not concerned with semantics.
 */
class DeltaLayout extends Component {
  static DIRECTION_UP = 1;
  static DIRECTION_FLAT = 0;
  static DIRECTION_DOWN = -1;

  static propTypes = {
    value: PropTypes.any.isRequired,
    delta: PropTypes.any,
    direction: PropTypes.oneOf([
      DeltaLayout.DIRECTION_UP,
      DeltaLayout.DIRECTION_FLAT,
      DeltaLayout.DIRECTION_DOWN
    ]).isRequired
  };

  static build = (value, delta, formatter, formatterForDelta, reverseArrow) => {
    const reverseSign = reverseArrow == true ? -1 : 1;
    return (
      <DeltaLayout
        value={formatter(value)}
        delta={delta == null ? null : formatterForDelta(delta)}
        direction={reverseSign * Math.sign(delta)}
      />
    );
  };

  render() {
    const deltaArrow =
      this.props.direction > 0 ? "▲" : this.props.direction < 0 ? "▼" : "▶";
    const deltaColor =
      this.props.direction > 0
        ? "text-remark-trend-up"
        : this.props.direction < 0
        ? "text-remark-trend-down"
        : "text-remark-trend-flat";

    const deltaSection =
      this.props.delta == null ? (
        <>
          <span className={`${deltaColor} pl-2 pr-1`}>&nbsp;</span>
          <span className="text-remark-ui-text">&nbsp;</span>
        </>
      ) : (
        <>
          <span className={`${deltaColor} pl-2 pr-1`}>{deltaArrow}</span>
          <span className="text-remark-ui-text">{this.props.delta}</span>
        </>
      );

    return (
      <span className="flex flex-col leading-tight">
        <span>{this.props.value}</span>
        <span className="text-base">{deltaSection}</span>
      </span>
    );
  }
}

/**
 * @description Wraps an arbitrary Box Component with desired formatting,
 * including formatting for the primary value, the target, and any deltas.
 *
 * @note This is where layout and semantics are tied together;
 * unless you have custom needs, you'll probably want to use one of the
 * *Box components defined using `withFormatters(...)`, below.
 */
const withFormatters = (WrappedComponent, formatter, deltaFormatter = null) => {
  const formatterForTarget = targetFormatter(formatter);
  const formatterForDelta = deltaFormatter || formatter;

  return class extends React.Component {
    render() {
      let { value, target, delta, reverseArrow, ...remaining } = this.props;
      const content = DeltaLayout.build(
        value,
        delta,
        formatter,
        formatterForDelta,
        reverseArrow
      );

      return (
        <WrappedComponent
          content={content}
          detail={formatterForTarget(target)}
          {...remaining}
        />
      );
    }
  };
};

// Define LargeBoxLayouts that take values and targets of various types.
const LargeMultipleBox = withFormatters(LargeBoxLayout, formatMultiple);
const LargePercentBox = withFormatters(
  LargeBoxLayout,
  formatPercent,
  formatDeltaPercent
);
const LargeNumberBox = withFormatters(LargeBoxLayout, formatNumber);
const LargeCurrencyBox = withFormatters(LargeBoxLayout, formatCurrency);
const LargeCurrencyShorthandBox = withFormatters(
  LargeBoxLayout,
  formatCurrencyShorthand
);
const LargeDateBox = withFormatters(LargeBoxLayout, formatDate);

// Define SmallBoxLayouts that take values and targets of various types.
const SmallMultipleBox = withFormatters(SmallBoxLayout, formatMultiple);
const SmallPercentBox = withFormatters(
  SmallBoxLayout,
  formatPercent,
  formatDeltaPercent
);
const SmallNumberBox = withFormatters(SmallBoxLayout, formatNumber);
const SmallCurrencyBox = withFormatters(SmallBoxLayout, formatCurrency);
const SmallCurrencyShorthandBox = withFormatters(
  SmallBoxLayout,
  formatCurrencyShorthand
);
const SmallDateBox = withFormatters(SmallBoxLayout, formatDate);

// Define FunnelBoxLayouts that take values and targets of various types.
const FunnelMultipleBox = withFormatters(FunnelBoxLayout, formatMultiple);
const FunnelPercentBox = withFormatters(
  FunnelBoxLayout,
  formatPercent,
  formatDeltaPercent
);
const FunnelNumberBox = withFormatters(FunnelBoxLayout, formatNumber);
const FunnelCurrencyBox = withFormatters(FunnelBoxLayout, formatCurrency);
const FunnelCurrencyShorthandBox = withFormatters(
  FunnelBoxLayout,
  formatCurrencyShorthand
);
const FunnelDateBox = withFormatters(FunnelBoxLayout, formatDate);

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
 * @class WhiskerPlot
 *
 * @classdesc A simple bar chart with area gradient that plots a whisker series.
 */
class WhiskerPlot extends Component {
  static propTypes = {
    series: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ).isRequired
  };

  static maybe = maybeSeries => {
    return maybeSeries ? <WhiskerPlot series={maybeSeries} /> : null;
  };

  constructor(props) {
    super(props);
    this.chartData = this.props.series.map((raw, i) => ({
      x: i,
      y: Number(raw)
    }));
    // Here's some wacky javascript for you to contemplate. :-)
    this.randomName = (((1 + Math.random()) * 0x10000) | 0).toString(16);
  }

  render() {
    return (
      <VictoryGroup
        padding={0}
        data={this.chartData}
        style={{
          data: {
            stroke: "#74EC98",
            strokeWidth: "7px",
            fill: `url(#${this.randomName})`
          }
        }}
      >
        {/* XXX TODO this causes a ton of very mysterious console error spew. FIXME -Dave */}
        <defs>
          <linearGradient
            id={this.randomName}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#74EC98" stopOpacity={1.0} />
            <stop offset="19%" stopColor="#74EC98" stopOpacity={0.738} />
            <stop offset="34%" stopColor="#74EC98" stopOpacity={0.541} />
            <stop offset="47%" stopColor="#74EC98" stopOpacity={0.382} />
            <stop offset="57%" stopColor="#74EC98" stopOpacity={0.278} />
            <stop offset="65%" stopColor="#74EC98" stopOpacity={0.194} />
            <stop offset="73%" stopColor="#74EC98" stopOpacity={0.126} />
            <stop offset="80%" stopColor="#74EC98" stopOpacity={0.075} />
            <stop offset="86%" stopColor="#74EC98" stopOpacity={0.042} />
            <stop offset="91%" stopColor="#74EC98" stopOpacity={0.021} />
            <stop offset="95%" stopColor="#74EC98" stopOpacity={0.008} />
            <stop offset="98%" stopColor="#74EC98" stopOpacity={0.002} />
            <stop offset="100%" stopColor="#74EC98" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        {/* I don't really know what interpolation we'll like best. This looks nice for now. */}
        <VictoryArea interpolation="basis" />
      </VictoryGroup>
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
  static HeadlineNumbers = ({ report: r }) => {
    return (
      <BoxRow>
        <LargeBoxLayout
          name="Leased"
          content={DeltaLayout.build(
            r.leased_rate,
            r.delta_leased_rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.leased_units
          )} Executed Leases (Out of ${formatNumber(r.occupiable_units)})`}
          detail2={formatTargetPercent(r.target_lease_percent)}
          innerBox={WhiskerPlot.maybe(r.whiskers.leased_rate)}
        />
        <LargeBoxLayout
          name="Retention"
          content={DeltaLayout.build(
            r.renewal_rate,
            r.delta_renewal_rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.lease_renewal_notices
          )} Notices to Renew (Out of ${r.leases_due_to_expire} Due To Expire)`}
          detail2={formatTargetPercent(r.target_renewal_rate)}
          innerBox={WhiskerPlot.maybe(r.whiskers.renewal_rate)}
        />
        <LargeBoxLayout
          name="Occupied"
          content={DeltaLayout.build(
            r.occupancy_rate,
            r.delta_occupancy_rate,
            formatPercent,
            formatDeltaPercent
          )}
          detail={`${formatNumber(
            r.occupied_units
          )} Occupied Units (Out of ${formatNumber(r.occupiable_units)})`}
          detail2={formatTargetPercent(r.target_occupancy_rate)}
          innerBox={WhiskerPlot.maybe(r.whiskers.occupancy_rate)}
        />
      </BoxRow>
    );
  };

  /**
   * @name LeasingPerformanceReport.DetailNumbers
   * @description Component that renders the secondary leasing performance numbers.
   */
  static DetailNumbers = ({ report: r }) => {
    return (
      <BoxTable>
        <BoxRow>
          <BoxColumn>
            <SmallNumberBox
              name="Lease Applications"
              value={r.lease_applications}
              target={r.target_lease_applications}
              delta={r.delta_lease_applications}
            />
            <SmallNumberBox
              name="Cancellations and Denials"
              value={r.lease_cds}
              target={r.target_lease_cds}
              delta={r.delta_lease_cds}
            />
          </BoxColumn>
          <BoxColumn>
            <SmallNumberBox
              name="Notices to Renew"
              value={r.lease_renewals}
              target={r.target_lease_renewals}
              delta={r.delta_lease_renewals}
            />
            <SmallNumberBox
              name="Notices to Vacate"
              value={r.lease_vacation_notices}
              target={r.target_lease_vacation_notices}
              delta={r.delta_lease_vacation_notices}
            />
          </BoxColumn>
          <BoxColumn>
            <SmallNumberBox
              name="Move Ins"
              value={r.move_ins}
              target={r.target_move_ins}
              delta={r.delta_move_ins}
            />
            <SmallNumberBox
              name="Move Outs"
              value={r.move_outs}
              target={r.target_move_outs}
              delta={r.delta_move_outs}
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
  static HeadlineNumbers = ({ report: r }) => {
    return (
      <BoxRow>
        <LargePercentBox
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
          reverseArrow={true}
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
      <div className="flex flex-row flex-grow items-stretch pt-8">
        <div className="w-1/6">{header}</div>
        <div className="w-5/6 flex flex-row flex-grow items-stretch">
          {content}
        </div>
      </div>
    );
  };

  static FunnelHeaderBox = ({ number, name, more }) => {
    return (
      <div className="k-funnel-label">
        <div className={`bg-remark-funnel-${number}`}>
          <div>{name}</div>
        </div>
        <div className={`text-remark-funnel-${number + 1}`}>
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
 * @description A dropdown menu that lets us change the visible span.
 */
class ReportSpanDropdown extends Component {
  static propTypes = {
    current_report_link: PropTypes.object.isRequired,
    report_links: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  onChange = event => {
    // TODO what should we do here?
    document.location = event.target.value;
  };

  renderOptions() {
    let options = [];
    for (let section of this.props.report_links) {
      // ignore section.name for now?
      for (let link of section.periods) {
        options.push(
          <option key={link.url} value={link.url}>
            {link.description}
          </option>
        );
      }
    }
    return options;
  }

  render() {
    return (
      <>
        <span
          className="cursor-pointer inline-block align-middle mx-4 -my-4 px-4 py-2 rounded"
          style={{ backgroundColor: "#232837" }}
        >
          <select
            className="k-dropdown"
            defaultValue={this.props.current_report_link.url}
            onChange={this.onChange}
          >
            {this.renderOptions()}
          </select>
        </span>
      </>
    );
  }
}

/**
 * @description Top-level project tabs
 */
class ProjectTabs extends Component {
  static propTypes = {
    current_report_link: PropTypes.object.isRequired,
    report_links: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  render() {
    return (
      <div className="k-tabs-container">
        <ul>
          <li className="selected">Performance</li>
          <li>Model</li>
          <li>Market</li>
          <li>Team</li>
          <li className="absolute pin-r">
            <ReportSpanDropdown
              current_report_link={this.props.current_report_link}
              report_links={this.props.report_links}
            />
          </li>
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
      </NavigationItems>
    );

    return (
      <div className="page">
        <Header navigationItems={navigationItems}>
          <>
            <ProjectTabs
              current_report_link={this.props.current_report_link}
              report_links={this.props.report_links}
            />
            <Report report={this.props.report} />
          </>
        </Header>
      </div>
    );
  }
}
