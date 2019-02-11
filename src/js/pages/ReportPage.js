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
 * @class LargeValueBox
 *
 * @classdesc A simple layout intended to emphasize a single metric. Uses large
 * text sizing, bright colors, and lots of white space.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class LargeValueBox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    detail2: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="flex flex-col p-6 h-64 k-rectangle items-center text-center justify-center">
        {/* Container for the value itself.
            Counter-intuitively items- and text- center the rows and row content
            while justif- centers the rows vertically within the box. */}
        <span className="text-remark-ui-text-light text-base">
          {this.props.name}
        </span>
        <span className="text-remark-ui-text-lightest text-6xl font-hairline py-2">
          {this.props.value}
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
 * @class SmallValueBox
 *
 * @classdesc A simple layout intended to display a secondary metric. Uses
 * smaller text sizing, dimmer colors, and a little less white space.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class SmallValueBox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="flex flex-row h-full py-8 k-rectangle">
        {/* Container for the value itself */}
        <div className="text-6xl w-1/3 flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline text-center">
            {this.props.value}
          </div>
        </div>
        {/* Container for the label and help text */}
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
 * @class FunnelValueBox
 *
 * @classdesc A simple layout intended to metrics in a funnel grid/table.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
class FunnelValueBox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  };

  render() {
    return (
      <div className="flex flex-row h-32 py-8 k-rectangle">
        {/* Container for the value itself */}
        <div className="text-6xl w-1/3 flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline text-center">
            {this.props.value}
          </div>
        </div>
        {/* Container for the label and help text */}
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
 * @description Return a style object that partitions width into N.
 *
 * @note We simply divide the width into (100/n)% where n is the number
 * of partitions we would like. We use toPrecision(...) to match the
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
   * @description Render the most important leasing performance numbers.
   */
  renderHeadlineNumbers() {
    const r = this.props.report;
    return (
      <BoxRow>
        <LargeValueBox
          name="Leased"
          value={formatPercent(r.leased_rate)}
          detail={`${formatNumber(
            r.leased_units
          )} Executed Leases (Out of ${formatNumber(r.occupiable_units)})`}
          detail2={formatTargetPercent(r.target_lease_percent)}
        />
        <LargeValueBox
          name="Retention"
          value={formatPercent(r.renewal_rate)}
          detail={`${formatNumber(
            r.lease_renewal_notices
          )} Notices to Renew (Out of ${r.leases_due_to_expire} Due To Expire)`}
          detail2={formatTargetPercent(r.target_renewal_rate)}
        />
        <LargeValueBox
          name="Occupied"
          value={formatPercent(r.occupancy_rate)}
          detail={`${formatNumber(
            r.occupied_units
          )} Occupied Units (Out of ${formatNumber(r.occupiable_units)})`}
          detail2={formatTargetPercent(r.target_occupancy_rate)}
        />
      </BoxRow>
    );
  }

  /**
   * @description Render the secondary leasing performance numbers.
   */
  renderDetailNumbers() {
    const r = this.props.report;
    return (
      <BoxTable>
        <BoxRow>
          <SmallValueBox
            name="Lease Applications"
            value={formatNumber(r.lease_applications)}
            detail={formatTargetNumber(r.target_lease_applications)}
          />
          <SmallValueBox
            name="Notices to Renew"
            value={formatPercent(r.lease_renewals)}
            detail={formatTargetPercent(r.target_lease_renewals)}
          />
          <SmallValueBox
            name="Move Ins"
            value={formatNumber(r.move_ins)}
            detail={formatTargetNumber(r.target_move_ins)}
          />
        </BoxRow>
        <BoxRow>
          <SmallValueBox
            name="Cancellations and Denials"
            value={formatNumber(r.lease_cds)}
            detail={formatTargetNumber(r.target_lease_cds)}
          />
          <SmallValueBox
            name="Notices to Vacate"
            value={formatNumber(r.lease_vacation_notices)}
            detail={formatTargetNumber(r.target_lease_vacation_notices)}
          />
          <SmallValueBox
            name="Move Outs"
            value={formatNumber(r.move_outs)}
            detail={formatTargetNumber(r.target_move_outs)}
          />
        </BoxRow>
      </BoxTable>
    );
  }

  /**
   * @description Render the leasing performance report section
   */
  render() {
    return (
      <ReportSection name="Leasing Performance" bottomBoundary={true}>
        {this.renderHeadlineNumbers()}
        {this.renderDetailNumbers()}
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
   * @description Return victoryjs-style chart data from arbitrary investment fields.
   */
  getChartData = data => [
    {
      category: "Reputation Building",
      investment: Number(data.reputation_building),
      color: "#4035f4"
    },
    {
      category: "Demand Creation",
      investment: Number(data.demand_creation),
      color: "#5147ff"
    },
    {
      category: "Leasing Enablement",
      investment: Number(data.leasing_enablement),
      color: "#867ffe"
    },
    {
      category: "Market Intelligence",
      investment: Number(data.market_intelligence),
      color: "#675efc"
    }
  ];

  /**
   * @description Return victoryjs-style chart data from acq_investment fields.
   */
  getAcqChartData = () =>
    this.getChartData({
      reputation_building: this.props.report.acq_reputation_building,
      demand_creation: this.props.report.acq_demand_creation,
      leasing_enablement: this.props.report.acq_leasing_enablement,
      market_intelligence: this.props.report.acq_market_intelligence
    });

  /**
   * @description Return victoryjs-style chart data from ret_investment fields.
   */
  getRetChartData = () =>
    this.getChartData({
      reputation_building: this.props.report.ret_reputation_building,
      demand_creation: this.props.report.ret_demand_creation,
      leasing_enablement: this.props.report.ret_leasing_enablement,
      market_intelligence: this.props.report.ret_market_intelligence
    });

  /**
   * @description Render the headline numbers for the campaign investment report
   */
  renderHeadlineNumbers() {
    const r = this.props.report;
    return (
      <BoxRow>
        <LargeValueBox
          name="Campaign Investment"
          value={formatCurrencyShorthand(r.investment)}
          detail={`Target: ${formatCurrencyShorthand(r.target_investment)}`}
        />
        <LargeValueBox
          name="Est. Revenue Change"
          value={formatCurrencyShorthand(r.estimated_revenue_gain)}
          detail={formatTargetCurrencyShorthand(
            r.target_estimated_revenue_gain
          )}
        />
        <LargeValueBox
          name="Campaign Return on Marketing Investment (ROMI)"
          value={formatMultiple(r.romi)}
          detail={formatTargetMultiple(r.target_romi)}
        />
      </BoxRow>
    );
  }

  /**
   * @description Render campaign acq_investment detail numbers
   */
  renderAcqDetails() {
    const r = this.props.report;
    return (
      <ReportSection name="Acquisition" bottomBoundary={false}>
        <BoxRow>
          <SmallValueBox
            name="Leased Unit Change"
            value={formatNumber(r.delta_leases)}
            detail={formatTargetNumber(r.target_delta_leases)}
          />
          <SmallValueBox
            name="Est. Acquired Leasing Revenue"
            value={formatCurrencyShorthand(r.estimated_acq_revenue_gain)}
            detail={formatTargetCurrencyShorthand(
              r.target_estimated_acq_revenue_gain
            )}
          />
        </BoxRow>
        <BoxRow>
          <SmallValueBox
            name="Acquisition Investment"
            value={formatCurrencyShorthand(r.acq_investment)}
            detail={formatTargetCurrencyShorthand(r.target_acq_investment)}
          />
          <SmallValueBox
            name="Acquisition ROMI"
            value={formatMultiple(r.acq_romi)}
            detail={formatTargetMultiple(r.target_acq_romi)}
          />
        </BoxRow>
      </ReportSection>
    );
  }

  /**
   * @description Render an arbitrary campaign investment chart
   */
  renderChart = (name, data) => {
    return (
      <ReportSection name={name} bottomBoundary={false}>
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
   * @description Render campaign acq_investment chart
   */
  renderAcqChart = () =>
    this.renderChart(
      "Acquisition Investment Allocations",
      this.getAcqChartData()
    );

  /**
   * @description Render acqusition report section.
   */
  renderAcq() {
    return (
      <StackedBox>
        {this.renderAcqDetails()}
        {this.renderAcqChart()}
      </StackedBox>
    );
  }

  /**
   * @description Render campaign ret_investment detail numbers
   */
  renderRetDetails() {
    const r = this.props.report;
    return (
      <ReportSection name="Retention" bottomBoundary={false}>
        <BoxRow>
          <SmallValueBox
            name="Lease Renewals"
            value={formatNumber(r.lease_renewals)}
            detail={formatTargetNumber(r.target_lease_renewals)}
          />
          <SmallValueBox
            name="Est. Retained Leasing Revenue"
            value={formatCurrencyShorthand(r.estimated_ret_revenue_gain)}
            detail={formatTargetCurrencyShorthand(
              r.target_estimated_ret_revenue_gain
            )}
          />
        </BoxRow>
        <BoxRow>
          <SmallValueBox
            name="Retention Investment"
            value={formatCurrencyShorthand(r.ret_investment)}
            detail={formatTargetCurrencyShorthand(r.target_ret_investment)}
          />
          <SmallValueBox
            name="Retention ROMI"
            value={formatMultiple(r.ret_romi)}
            detail={formatTargetMultiple(r.target_ret_romi)}
          />
        </BoxRow>
      </ReportSection>
    );
  }

  /**
   * @description Render campaign ret_investment chart
   */
  renderRetChart = () =>
    this.renderChart(
      "Retention Investment Allocations",
      this.getRetChartData()
    );

  /**
   * @description Render retention report section.
   */
  renderRet() {
    return (
      <StackedBox>
        {this.renderRetDetails()}
        {this.renderRetChart()}
      </StackedBox>
    );
  }

  /**
   * @description Render the campaign investment report section
   */
  render() {
    return (
      <ReportSection name="Campaign Investment" bottomBoundary={true}>
        {this.renderHeadlineNumbers()}
        <BoxRow>
          {this.renderAcq()}
          {this.renderRet()}
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
            <LargeValueBox
              name="USV > EXE"
              value={formatPercent(r.usv_exe_perc)}
              detail={formatTargetPercent(r.target_usv_exe_perc)}
            />
          </div>
          <div className="w-1/3 m-2">
            <LargeValueBox
              name="Cancellation & Denial Rate"
              value={formatPercent(r.lease_cd_rate)}
              detail={formatTargetPercent(r.target_lease_cd_rate)}
            />
          </div>
          <div className="w-1/3 m-2">
            <LargeValueBox
              name="Cost Per EXE / Average Monthly Rent"
              value={formatPercent(r.cost_per_exe_vs_monthly_average_rent)}
              detail={formatTargetPercent(
                r.target_cost_per_exe_vs_monthly_average_rent
              )}
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
              <FunnelValueBox
                name="Volume of USV"
                value={formatNumber(r.usvs)}
                detail={formatTargetNumber(r.target_usvs)}
              />
              <FunnelValueBox
                name="Volume of INQ"
                value={formatNumber(r.inquiries)}
                detail={formatTargetNumber(r.target_inquiries)}
              />
              <FunnelValueBox
                name="Volume of TOU"
                value={formatNumber(r.tours)}
                detail={formatTargetNumber(r.target_tours)}
              />
              <FunnelValueBox
                name="Volume of APP"
                value={formatNumber(r.lease_applications)}
                detail={formatTargetNumber(r.target_lease_applications)}
              />
              <FunnelValueBox
                name="Volume of EXE"
                value={formatNumber(r.leases_executed)}
                detail={formatTargetNumber(r.target_leases_executed)}
              />
            </div>

            {/* Table: percentages column */}

            <div className="w-1/3 flex flex-col">
              <FunnelValueBox
                name="USV > INQ"
                value={formatPercent(r.usv_inq_perc)}
                detail={formatTargetPercent(r.target_usv_inq_perc)}
              />
              <FunnelValueBox
                name="INQ > TOU"
                value={formatPercent(r.inq_tou_perc)}
                detail={formatTargetPercent(r.target_inq_tou_perc)}
              />
              <FunnelValueBox
                name="TOU > APP"
                value={formatPercent(r.tou_app_perc)}
                detail={formatTargetPercent(r.target_tou_app_perc)}
              />
              <FunnelValueBox
                name="APP > EXE"
                value={formatPercent(r.app_exe_perc)}
                detail={formatTargetPercent(r.target_app_exe_perc)}
              />
            </div>

            {/* Table: cost-pers column */}

            <div className="w-1/3 flex flex-col">
              <FunnelValueBox
                name="Cost per USV"
                value={formatCurrency(r.cost_per_usv)}
                detail={formatTargetCurrency(r.target_cost_per_usv)}
              />
              <FunnelValueBox
                name="Cost per INQ"
                value={formatCurrency(r.cost_per_inq)}
                detail={formatTargetCurrency(r.target_cost_per_inq)}
              />
              <FunnelValueBox
                name="Cost per TOU"
                value={formatCurrency(r.cost_per_tou)}
                detail={formatTargetCurrency(r.target_cost_per_tou)}
              />
              <FunnelValueBox
                name="Cost per APP"
                value={formatCurrency(r.cost_per_app)}
                detail={formatTargetCurrency(r.target_cost_per_app)}
              />
              <FunnelValueBox
                name="Cost per EXE"
                value={formatCurrency(r.cost_per_exe)}
                detail={formatTargetCurrency(r.target_cost_per_exe)}
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
