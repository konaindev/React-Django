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
  render() {
    return null;
  }
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
    if (goal != 0) {
      // CHOONG: does this even make sense?
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
          <span className="text-remark-ui-text text-sm">Target: {goal}</span>
        </div>
      </div>
    );
  }
}

/**
 * @description A value box focused on a single metric for the funnel grid
 */
class FunnelValueBox extends Component {
  static propTypes = VALUE_BOX_PROP_TYPES;
  formatter = String;

  formatValue(v) {
    if (isNaN(Number(v))) {
      return v; // Pass strings through to make TODO placeholders more obvious
    }
    return this.formatter(v);
  }

  render() {
    var showGoal = false;
    var goal = this.props.goal;
    if (goal != 0) {
      // CHOONG: does this even make sense?
      var showGoal = true;
      var pctOfGoal = Math.round((100.0 * Number(this.props.value)) / goal);
    }

    return (
      <div className="flex flex-row h-32 py-8 k-rectangle">
        {/* Container for the value itself */}
        <div className="text-6xl w-1/3 flex flex-col leading-compressed justify-center content-center">
          <div className="text-remark-ui-text-lightest font-hairline text-center">
            {this.formatValue(this.props.value)}
          </div>
        </div>
        {/* Container for the label and help text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm">
            Target: {this.formatValue(goal)}
          </span>
        </div>
      </div>
    );
  }
}

class FunnelValueBoxDollars extends FunnelValueBox {
  formatter = formatCurrency;
}

class FunnelValueBoxPercentage extends FunnelValueBox {
  formatter = formatPercent;
}

/**
 * @description A named, grouped section of a report
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
 * @description A fully rendered report
 */
class Report extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  /**
   * @description Return acquisition investment data in a structure suitable for Victory charts.
   */
  getAcquisitionInvestmentData() {
    const reputationBuilding = {
      category: "Reputation Building",
      investment: Number(this.props.report.acq_reputation_building),
      color: "#4035f4"
    };

    const demandCreation = {
      category: "Demand Creation",
      investment: Number(this.props.report.acq_demand_creation),
      color: "#5147ff"
    };

    const leasingEnablement = {
      category: "Leasing Enablement",
      investment: Number(this.props.report.acq_leasing_enablement),
      color: "#867ffe"
    };

    const marketIntelligence = {
      category: "Market Intelligence",
      investment: Number(this.props.report.acq_market_intelligence),
      color: "#675efc"
    };

    // all categories
    const categories = [
      reputationBuilding,
      demandCreation,
      leasingEnablement,
      marketIntelligence
    ];

    // drop any category with $0 investment and return
    return categories.filter(datum => datum.investment);
  }

  /**
   * @description Return retention investment data in a structure suitable for Victory charts.
   */
  getRetentionInvestmentData() {
    const reputationBuilding = {
      category: "Reputation Building",
      investment: Number(this.props.report.ret_reputation_building),
      color: "#4035f4"
    };

    const demandCreation = {
      category: "Demand Creation",
      investment: Number(this.props.report.ret_demand_creation),
      color: "#5147ff"
    };

    const leasingEnablement = {
      category: "Leasing Enablement",
      investment: Number(this.props.report.ret_leasing_enablement),
      color: "#867ffe"
    };

    const marketIntelligence = {
      category: "Market Intelligence",
      investment: Number(this.props.report.ret_market_intelligence),
      color: "#675efc"
    };

    // all categories
    const categories = [
      reputationBuilding,
      demandCreation,
      leasingEnablement,
      marketIntelligence
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
                          of ${r.occupiable_units})`}
                detail2={`Target: ${formatPercent(r.target_lease_percent)}`}
              />
            </div>
            <div className="w-1/3 m-2">
              <PrimaryValueBox
                name="Retention"
                value={`TODO%`}
                detail1={`TODO of TODO Resident Decisions (Out of total leases)"`}
                detail2={`Target: TODO%"`}
              />
            </div>
            <div className="w-1/3 m-2">
              <PrimaryValueBox
                name="Occupied"
                value={`TODO`}
                detail1={`TODO Occupied Units (Out of ${r.occupiable_units})`}
                detail2={`Target: TODO%`}
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
                goal={r.target_lease_applications}
              />
            </div>
            <div className="w-1/3 m-2">
              <SecondaryValueBox
                name="Notices to Renew"
                value={formatPercent(r.lease_renewals)}
                goal={formatPercent(r.target_lease_renewals)}
              />
            </div>
            <div className="w-1/3 m-2">
              <SecondaryValueBox name="Move Ins" value={`TODO`} goal={`TODO`} />
            </div>
          </div>
          <div className="flex flex-row flex-grow items-stretch">
            {/* Row */}
            <div className="w-1/3 m-2">
              <SecondaryValueBox
                name="Cancellations & Denials"
                value={`TODO`}
                goal={`TODO`}
              />
            </div>
            <div className="w-1/3 m-2">
              <SecondaryValueBox
                name="Notices to Vacate"
                value={r.leases_ended}
                goal={`TODO -- is there even a target_leases_ended field?`}
              />
            </div>
            <div className="w-1/3 m-2">
              <SecondaryValueBox
                name="Move Outs"
                value={`TODO`}
                goal={`TODO`}
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
                value={formatCurrencyShorthand(r.investment)}
                detail1={`Target: ${formatCurrencyShorthand(
                  r.target_investment
                )}`}
              />
            </div>
            <div className="w-1/3 m-2">
              <PrimaryValueBox
                name="Est. Revenue Change"
                value={formatCurrencyShorthand(r.estimated_revenue_gain)}
                detail1={`Target: $TODOk`}
              />
            </div>
            <div className="w-1/3 m-2">
              <PrimaryValueBox
                name="Campaign Return on Marketing Investment (ROMI)"
                value={`${r.romi}X`}
                detail1={`Target: TODO`}
              />
            </div>
          </div>
        </ReportSection>

        <div className="flex flex-row">
          <div className="w-1/2 flex flex-col">
            <ReportSection name="Acquisition" bottomBoundary={true}>
              <SecondaryValueBox
                name="Leased Unit Change"
                value={r.delta_leases}
                goal={r.target_delta_leases}
              />
              <SecondaryValueBox
                name="Acquisition Investment"
                value="TODO"
                goal="TODO"
              />
              <SecondaryValueBox
                name="Est. Acquired Leasing Revenue"
                value={formatCurrencyShorthand(r.estimated_acq_revenue_gain)}
                goal={formatCurrencyShorthand(
                  r.target_estimated_acq_revenue_gain
                )}
              />
              <SecondaryValueBox
                name="Acquisition ROMI"
                value={`${r.acq_romi}x`}
                goal={`${r.target_acq_romi}x`}
              />
            </ReportSection>
            <ReportSection
              name="Acquisition Investment Allocations"
              bottomBoundary={true}
            >
              TODO: fix styling
              <VictoryChart>
                <VictoryBar
                  data={this.getAcquisitionInvestmentData()}
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
          </div>

          <div className="w-1/2 flex flex-col">
            <ReportSection name="Retention" bottomBoundary={true}>
              <SecondaryValueBox
                name="Lease Renewals"
                value={r.lease_renewals}
                goal={r.target_lease_renewals}
              />
              <SecondaryValueBox
                name="Retention Investment"
                value={formatCurrencyShorthand(r.ret_investment)}
                goal={`Target: ${formatCurrencyShorthand(
                  r.target_ret_investment
                )}`}
              />
              <SecondaryValueBox
                name="Est. Retained Leasing Revenue"
                value={formatCurrencyShorthand(r.estimated_ret_revenue_gain)}
                goal="TODO"
              />
              <SecondaryValueBox
                name="Retention ROMI"
                value="TODO"
                goal="TODO"
              />
            </ReportSection>
            <ReportSection
              name="Retention Investment Allocations"
              bottomBoundary={true}
            >
              <VictoryChart>
                <VictoryBar
                  data={this.getRetentionInvestmentData()}
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
          </div>
        </div>

        <ReportSection name="Acquisition Funnel" bottomBoundary={true}>
          {/* Headline numbers for the acquisition funnel. */}
          <div className="flex flex-row flex-grow items-stretch">
            <div className="w-1/3 m-2">
              <PrimaryValueBox
                name="USV > EXE"
                value={`TODO%`}
                detail1={`Target: TODO%`}
              />
            </div>
            <div className="w-1/3 m-2">
              <PrimaryValueBox
                name="Cancellation & Denial Rate"
                value={`TODO%`}
                detail1={`Target: TODO%`}
              />
            </div>
            <div className="w-1/3 m-2">
              <PrimaryValueBox
                name="Cost Per EXE / Lowest Monthly Rent"
                value={`TODO%`}
                detail1={`Target: TODO%`}
              />
            </div>
          </div>

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
            <div className="w-5/6 flex flex-row flex-grow items-stretch">
              <div className="w-1/3 flex flex-col items">
                <FunnelValueBox
                  name="Volume of USV"
                  value={r.usvs}
                  goal={r.target_usvs}
                />
                <FunnelValueBox
                  name="Volume of INQ"
                  value={r.inquiries}
                  goal={r.target_inquiries}
                />
                <FunnelValueBox
                  name="Volume of TOU"
                  value={r.tours}
                  goal={r.target_tours}
                />
                <FunnelValueBox
                  name="Volume of APP"
                  value={r.lease_applications}
                  goal={r.target_lease_applications}
                />
                <FunnelValueBox
                  name="Volume of EXE"
                  value={r.leases_executed}
                  goal={r.target_leases_executed}
                />
              </div>
              <div className="w-1/3 flex flex-col">
                <FunnelValueBoxPercentage
                  name="USV > INQ"
                  value={r.usv_inq_perc}
                  goal={r.target_usv_inq_perc}
                />
                <FunnelValueBoxPercentage
                  name="INQ > TOU"
                  value={r.inq_tou_perc}
                  goal={r.target_inq_tou_perc}
                />
                <FunnelValueBoxPercentage
                  name="TOU > APP"
                  value={r.tou_app_perc}
                  goal={r.target_tou_app_perc}
                />
                <FunnelValueBoxPercentage
                  name="APP > EXE"
                  value={r.app_exe_perc}
                  goal={r.target_app_exe_perc}
                />
              </div>
              <div className="w-1/3 flex flex-col">
                <FunnelValueBoxDollars
                  name="Cost per USV"
                  value={r.cost_per_usv}
                  goal="TODO"
                />
                <FunnelValueBoxDollars
                  name="Cost per INQ"
                  value={r.cost_per_inq}
                  goal="TODO"
                />
                <FunnelValueBoxDollars
                  name="Cost per TOU"
                  value={r.cost_per_tou}
                  goal="TODO"
                />
                <FunnelValueBoxDollars
                  name="Cost per APP"
                  value={r.cost_per_app}
                  goal="TODO"
                />
                <FunnelValueBoxDollars
                  name="Cost per EXE"
                  value={r.cost_per_exe}
                  goal="TODO"
                />
              </div>
            </div>
          </div>
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
