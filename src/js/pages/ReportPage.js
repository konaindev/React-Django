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
        <span className="text-remark-ui-text text-sm">{this.props.detail}</span>
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
    var goal = Number(this.props.goal);
    if (goal != 0) {
      showGoal = true;
      pctOfGoal = Math.round((100.0 * Number(this.props.value)) / goal);
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
            {this.props.detail}
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
    const DISTANCE = 100;
    const angle =
      (this.props.slice.startAngle + this.props.slice.endAngle) / 2.0;
    const dx = Math.cos(angle) * DISTANCE;
    const dy = Math.sin(angle) * DISTANCE;
    console.log(angle, this.props);

    // build and return the full label
    return (
      <g>
        <text {...cleanProps}>
          <tspan fill="#CCCCCC">{this.props.datum.category}</tspan>
          <tspan x={this.props.x} dy="1.25rem" fill="#68788C">
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

  renderPropertySection() {
    return (
      <ReportSection name="Property" bottomBoundary={true}>
        <div className="flex -m-2">
          {/* Primary metric */}
          <div className="w-1/4 m-2">
            <PrimaryValueBox
              name="Leased"
              value={formatPercent(this.props.report.leased_rate)}
              detail={
                <span>
                  {`${this.props.report.leased_units} of ${
                    this.props.report.leasable_units
                  } Leasable Units`}
                  <br />
                  {`Target ${
                    this.props.report.target_leased_units
                  } (${formatPercent(this.props.report.target_lease_percent)})`}
                </span>
              }
            />
          </div>

          {/* Secondary metrics flex -- the -m-2 we'd normally put here negates the m-2 for the box*/}
          <div className="flex flex-col flex-grow items-stretch">
            {/* row */}
            <div className="flex flex-row flex-grow items-stretch">
              <div className="w-1/2 m-2">
                <SecondaryValueBox
                  name="Leases Executed"
                  value={formatNumber(this.props.report.leases_executed)}
                  goal={this.props.report.leases_executed_goal}
                />
              </div>
              <div className="w-1/2 m-2">
                <SecondaryValueBox
                  name="Renewals"
                  value={formatNumber(this.props.report.leases_renewed)}
                  goal={this.props.report.leases_renewed_goal}
                />
              </div>
            </div>
            {/* row */}
            <div className="flex flex-row flex-grow">
              <div className="w-1/2 m-2">
                <SecondaryValueBox
                  name="Leases Ended"
                  value={formatNumber(this.props.report.leases_ended)}
                  goal={this.props.report.leases_ended_goal}
                />
              </div>
              <div className="w-1/2 m-2">
                <SecondaryValueBox
                  name="Net Lease Change"
                  value={formatNumber(this.props.report.net_lease_change)}
                  goal={this.props.report.net_lease_change_goal}
                />
              </div>
            </div>
          </div>
        </div>
      </ReportSection>
    );
  }

  renderResidentAcquisitionFunnelSection() {
    return (
      <ReportSection name="Resident Acquisition Funnel" bottomBoundary={true}>
        <table className="k-report-table w-full" cellSpacing="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actual</th>
              <th>Target</th>
              <th>Converted</th>
              <th>Cost Per</th>
            </tr>
          </thead>
          <tbody>
            <tr className="k-rectangle">
              <th>Unique Website Visitors</th>
              <td>{formatNumber(this.props.report.usvs)}</td>
              <td>{formatNumber(this.props.report.usvs_goal)}</td>
              <td>&nbsp;</td>
              <td>{formatCurrency(this.props.report.cost_per_usv, true)}</td>
            </tr>
            <tr className="k-rectangle">
              <th>Inquiries</th>
              <td>{formatNumber(this.props.report.inquiries)}</td>
              <td>{formatNumber(this.props.report.inquiries_goal)}</td>
              <td>
                {formatPercent(this.props.report.usvs_to_inquiries_percent, 1)}
              </td>
              <td>
                {formatCurrency(this.props.report.cost_per_inquiry, true)}
              </td>
            </tr>
            <tr className="k-rectangle">
              <th>Tours</th>
              <td>{formatNumber(this.props.report.tours)}</td>
              <td>{formatNumber(this.props.report.tours_goal)}</td>
              <td>
                {formatPercent(this.props.report.inquiries_to_tours_percent, 1)}
              </td>
              <td>{formatCurrency(this.props.report.cost_per_tour, true)}</td>
            </tr>
            <tr className="k-rectangle">
              <th>Lease Applications</th>
              <td>{formatNumber(this.props.report.lease_applications)}</td>
              <td>{formatNumber(this.props.report.lease_applications_goal)}</td>
              <td>
                {formatPercent(
                  this.props.report.tours_to_lease_applications_percent,
                  1
                )}
              </td>
              <td>
                {formatCurrency(
                  this.props.report.cost_per_lease_application,
                  true
                )}
              </td>
            </tr>
            <tr className="k-rectangle">
              <th>Lease Executions</th>
              <td>{formatNumber(this.props.report.leases_executed)}</td>
              <td>{formatNumber(this.props.report.leases_executed_goal)}</td>
              <td>
                {formatPercent(
                  this.props.report
                    .lease_applications_to_leases_executed_percent,
                  1
                )}
              </td>
              <td>
                {formatCurrency(
                  this.props.report.cost_per_lease_execution,
                  true
                )}
              </td>
            </tr>
          </tbody>
        </table>
        {/* And away we go! */}
      </ReportSection>
    );
  }

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

  renderEstimatedMarketingInvestmentAndReturnSection() {
    const investmentData = this.getInvestmentData();

    // Compute goal and target strings
    const investedBoxDetail = Number(
      this.props.report.marketing_investment_goal
    )
      ? `${formatPercent(
          Number(this.props.report.marketing_investment) /
            Number(this.props.report.marketing_investment_goal)
        )} of ${formatCurrencyShorthand(
          this.props.report.marketing_investment_goal
        )} (Budget Target)`
      : "No budget target set";

    const romiBoxDetail = Number(
      this.props.report.return_on_marketing_investment_goal
    )
      ? `Goal: ${this.props.report.return_on_marketing_investment_goal}x`
      : `No goal set`;

    const estRevenueBoxDetail = Number(
      this.props.report.estimated_annual_revenue_change_goal
    )
      ? `Goal: ${formatCurrencyShorthand(
          this.props.report.estimated_annual_revenue_change_goal
        )}`
      : `No goal set`;

    return (
      <ReportSection name="Estimated Marketing Investment And Return">
        <div>
          <div className="m-4 flex-grow h-96">
            <VictoryPie
              data={investmentData}
              innerRadius={100}
              labelRadius={180}
              labelComponent={
                <MarketingInvestmentChartLabel
                  marketingInvestment={this.props.report.marketing_investment}
                />
              }
              x="category"
              y="investment"
              style={{
                data: {
                  fill: datum => datum.color
                },
                /* stylelint-disable */
                /* this is victory specific styling; stylelint is maybe right to complain */
                labels: {
                  fontFamily: "formular",
                  fontWeight: "400",
                  fontSize: "1rem",
                  fill: "#cccccc"
                }
                /* stylelint-enable */
              }}
            />
          </div>
          <div className="flex -m-4">
            <div className="w-1/3 m-4">
              <PrimaryValueBox
                name="Invested"
                value={formatCurrencyShorthand(
                  this.props.report.marketing_investment
                )}
                detail={investedBoxDetail}
              />
            </div>
            <div className="w-1/3 m-4">
              <PrimaryValueBox
                name="ROMI"
                value={`${this.props.report.return_on_marketing_investment}x`}
                detail={romiBoxDetail}
              />
            </div>
            <div className="w-1/3 m-4">
              <PrimaryValueBox
                name="Est. Revenue Gain"
                value={formatCurrencyShorthand(
                  this.props.report.estimated_annual_revenue_change
                )}
                detail={estRevenueBoxDetail}
              />
            </div>
          </div>
        </div>
      </ReportSection>
    );
  }

  render() {
    // TODO: actual rendering code goes here. -Dave
    return (
      <>
        {this.renderPropertySection()}
        {this.renderResidentAcquisitionFunnelSection()}
        {this.renderEstimatedMarketingInvestmentAndReturnSection()}
      </>
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
