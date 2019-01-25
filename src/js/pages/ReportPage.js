import React, { Component } from "react";
import PropTypes from "prop-types";
import { VictoryPie, Text } from "victory";

import Header from "../components/Header";
import {
  NavigationItems,
  ProjectNavigationItem,
  ReportNavigationItem
} from "../components/Navigation";

import {
  formatPercent,
  formatNumber,
  formatCurrency,
  formatCurrencyShorthand,
  formatDate
} from "../utils/formatters";

/**
 * @description Property shape expected of all value boxes
 */
const VALUE_BOX_PROP_TYPES = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  detail: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

class Comment extends Component {
  render() { return null };
}

/**
 * @description A primary value box focused on a single metric
 */
class PrimaryValueBox extends Component {
  static propTypes = VALUE_BOX_PROP_TYPES;

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
        <span className="text-remark-ui-text text-sm">
          {this.props.detail1}
        </span>
        <span className="text-remark-ui-text text-sm">
          {this.props.detail2}
        </span>
      </div>
    );
  }
}

/**
 * @description A secondary value box focused on a single metric
 */
class SecondaryValueBox extends Component {
  static propTypes = VALUE_BOX_PROP_TYPES;

  render() {
    var showGoal = false;
    var goal = this.props.goal;
    if (goal != 0) {  // CHOONG: does this even make sense?
      var showGoal = true;
      var pctOfGoal = Math.round((100.0 * Number(this.props.value)) / goal);
    }

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
            Target: {goal}
          </span>
        </div>
      </div>
    );
  }
}

/**
 * @description A named, grouped section of a report
 */
class ReportSection extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
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
 * @description A custom label for the marketing investment pie chart
 */
class MarketingInvestmentChartLabel extends Component {
  render() {
    // remove unwanted props to pass to SVG <text /> element
    const { verticalAnchor, marketingInvestment, ...cleanProps } = this.props;

    // build the description
    const description = `${formatCurrencyShorthand(
      this.props.datum.investment
    )} (${formatPercent(
      Number(this.props.datum.investment) /
        Number(this.props.marketingInvestment)
    )})`;

    // compute a transform along the current angle
    // XXX this computation is wrong, because the angle has the origin as the
    // center of the donut, but we *want* an angle relative to the SVG viewbox origin. -Dave
    // const DISTANCE = 100;
    // const angle =
    //   (this.props.slice.startAngle + this.props.slice.endAngle) / 2.0;
    // const dx = Math.cos(angle) * DISTANCE;
    // const dy = Math.sin(angle) * DISTANCE;
    // console.log(angle, this.props);

    // compute REMs in javascript. safari's SVG handling doesn't like the "dy"
    // attribute so we have to set an explicit y={} property.
    const remsToPixels = rems =>
      rems * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const dyPixels = remsToPixels(1.25);
    const nextY = this.props.y + dyPixels;

    // build and return the full label
    return (
      <g>
        <text {...cleanProps}>
          <tspan fill="#CCCCCC">{this.props.datum.category}</tspan>
          <tspan x={this.props.x} y={nextY} fill="#68788C">
            {description}
          </tspan>
        </text>
      </g>
    );
  }
}

/**
 * @description A fully rendered report
 */
class Report extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  /**
   * @description Return marketing investment data in a structure suitable for Victory charts.
   */
  getInvestmentData() {
    const reputationBuilding = {
      category: "Reputation Building",
      investment: Number(this.props.report.investment_reputation_building),
      color: "#4035f4"
    };

    const demandCreation = {
      category: "Demand Creation",
      investment: Number(this.props.report.investment_demand_creation),
      color: "#5147ff"
    };

    const leasingEnablement = {
      category: "Leasing Enablement",
      investment: Number(this.props.report.investment_leasing_enablement),
      color: "#867ffe"
    };

    const marketIntelligence = {
      category: "Market Intelligence",
      investment: Number(this.props.report.investment_market_intelligence),
      color: "#675efc"
    };

    const residentRetention = {
      category: "Resident Retention",
      investment: Number(this.props.report.investment_resident_retention),
      color: "#A09afd"
    };

    // all categories
    const categories = [
      reputationBuilding,
      demandCreation,
      leasingEnablement,
      marketIntelligence,
      residentRetention
    ];

    // drop any category with $0 investment and return
    return categories.filter(datum => datum.investment);
  }

  render() {
    let r = this.props.report;
    return (
      <span>

      <ReportSection name="Leasing Performance" bottomBoundary={true}>
        {/* Headline performance numbers for the property. */}
        <div className="flex flex-row flex-grow items-stretch">
          <div className="w-1/3 m-2">
            <PrimaryValueBox
              name="Leased"
              value={formatPercent(r.leased_rate)}
              detail1={`${r.leased_units} Executed Leases (Out
                          of ${r.leasable_units})`}
              detail2={`Target: ${formatPercent(r.target_lease_percent)}`}
            />
          </div>
          <div className="w-1/3 m-2">
            <PrimaryValueBox
              name="Retention"
              value={`XX%`}
              detail1={`X of Y Resident Decisions (Out of total leases)"`}
              detail2={`Target: XX%"`}
            />
          </div>
          <div className="w-1/3 m-2">  
            <PrimaryValueBox
              name="Occupied"
              value={`XX`}
              detail1={`X Occupied Units (Out of ${r.leasable_units})`}
              detail2={`Target: XX%`}
            />
          </div>
        </div>
        {/* Performance detail. */}
        <div className="flex flex-row flex-grow items-stretch">
          {/* Row */}
          <div className="w-1/3 m-2">
            <SecondaryValueBox
              name="Lease Applications"
              value={r.lease_applications}
              goal={r.lease_applications_goal}
            />
          </div>
          <div className="w-1/3 m-2">
            <SecondaryValueBox
              name="Notices to Renew"
              value={formatPercent(r.leases_renewed)}
              goal={formatPercent(r.leases_renewed_goal)}
            />
          </div>
          <div className="w-1/3 m-2">  
            <SecondaryValueBox
              name="Move Ins"
              value={`XX`}
              goal={`XX`}
            />
          </div>
        </div>
        <div className="flex flex-row flex-grow items-stretch">
          {/* Row */}
          <div className="w-1/3 m-2">
            <SecondaryValueBox
              name="Cancellations & Denials"
              value={`XX`}
              goal={`XX`}
            />
          </div>
          <div className="w-1/3 m-2">
            <SecondaryValueBox
              name="Notices to Vacate"
              value={r.leases_ended}
              goal={r.leases_ended_goal}
            />
          </div>
          <div className="w-1/3 m-2">
            <SecondaryValueBox
              name="Move Outs"
              value={`XX`}
              goal={`XX`}
            />
          </div>
        </div>
      </ReportSection>

      <ReportSection name="Campaign Investment" bottomBoundary={true}>
        {/* Headline performance numbers for the property. */}
        <div className="flex flex-row flex-grow items-stretch">
          <div className="w-1/3 m-2">
            <PrimaryValueBox
              name="Campaign Investment"
              value={formatCurrencyShorthand(r.marketing_investment)}
              detail1={`Target: ${formatCurrencyShorthand(r.marketing_investment_goal)}`}
            />
          </div>
          <div className="w-1/3 m-2">
            <PrimaryValueBox
              name="Est. Revenue Change"
              value={formatCurrencyShorthand(r.estimated_annual_revenue_change)}
              detail1={`Target: $XXk`}
            />
          </div>
          <div className="w-1/3 m-2">  
            <PrimaryValueBox
              name="Campaign Return on Marketing Investment (ROMI)"
              value={`${r.return_on_marketing_investment}X`}
              detail1={`Target: XXX`}
            />
          </div>
        </div>
      </ReportSection>

      <div className="flex flex-row">
        <div className="w-1/2 flex flex-col">
          <ReportSection name="Acquisition" bottomBoundary={true}>
            <SecondaryValueBox
              name="Leased Unit Change"
              value={r.net_lease_change}
              goal={r.net_lease_change_goal}
            />
            <SecondaryValueBox
              name="Acquisition Investment"
              value="XX"
              goal="XX"
            />
            <SecondaryValueBox
              name="Est. Acquired Leasing Revenue"
              value={formatCurrencyShorthand(r.estimated_annual_revenue_change)}
              goal={formatCurrencyShorthand(r.estimated_annual_revenue_change_goal)}
            />
            <SecondaryValueBox
              name="Acquisition ROMI"
              value={`${r.return_on_marketing_investment}x`}
              goal={`${r.return_on_marketing_investment_goal}x`}
            />
          </ReportSection>
          <ReportSection name="Acquisition Investment Allocations" bottomBoundary={true}>
            XYZ
          </ReportSection>
        </div>

        <div className="w-1/2 flex flex-col">
          <ReportSection name="Retention" bottomBoundary={true}>
            <SecondaryValueBox
              name="Lease Renewals"
              value={r.leases_renewed}
              goal={r.leases_renewed_goal}
            />
            <SecondaryValueBox
              name="Retention Investment"
              value="XX"
              goal="XX"
            />
            <SecondaryValueBox
              name="Est. Retained Leasing Revenue"
              value="XX"
              goal="XX"
            />
            <SecondaryValueBox
              name="Retention ROMI"
              value="XX"
              goal="XX"
            />
          </ReportSection>
          <ReportSection name="Retention Investment Allocations" bottomBoundary={true}>
            XYZ
          </ReportSection>
        </div>
      </div>


      <ReportSection name="Acquisition Funnel" bottomBoundary={true}>
        {/* Headline numbers for the acquisition funnel. */}
        <div className="flex flex-row flex-grow items-stretch">
          <div className="w-1/3 m-2">
            <PrimaryValueBox
              name="USV > EXE"
              value={`XX%`}
              detail1={`Target: XX%`}
            />
          </div>
          <div className="w-1/3 m-2">
            <PrimaryValueBox
              name="Cancellation & Denial Rate"
              value={`XX%`}
              detail1={`Target: XX%`}
            />
          </div>
          <div className="w-1/3 m-2">  
            <PrimaryValueBox
              name="Cost Per EXE / Lowest Monthly Rent"
              value={`XX%`}
              detail1={`Target: XX%`}
            />
          </div>
        </div>
        TODO funnel table thing
      </ReportSection>

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
