import React, { Component } from "react";
import PropTypes from "prop-types";
import { VictoryPie, Text } from "victory";

import {
  formatPercent,
  formatNumber,
  formatCurrency,
  formatCurrencyShorthand
} from "../utils/formatters";

const VALUE_BOX_PROP_TYPES = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

/**
 * @description A primary value box focused on a single metric
 */
class PrimaryValueBox extends Component {
  static propTypes = VALUE_BOX_PROP_TYPES;

  render() {
    return (
      <div className="flex flex-col p-6 k-rectangle content-center">
        {/* Container for the value itself */}
        <span className="text-remark-ui-text-light text-base">
          {this.props.name}
        </span>
        <span className="text-remark-ui-text-lightest text-6xl">
          {this.props.value}
        </span>
        <span className="text-remark-ui-text text-sm">{this.props.help}</span>
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
    return (
      <div className="flex flex-row py-6 k-rectangle">
        {/* Container for the value itself */}
        <div className="text-6xl w-1/3 text-center flex-none leading-compressed">
          <span className="text-remark-ui-text-lightest">
            {this.props.value}
          </span>
        </div>
        {/* Container for the label and help text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm">{this.props.help}</span>
        </div>
      </div>
    );
  }
}

class ReportSection extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div className="p-8">
        <span className="text-remark-ui-text uppercase text-xs block mb-8">
          {this.props.name}
        </span>
        {this.props.children}
      </div>
    );
  }
}

class DonutLabel extends Component {
  render() {
    // remove unwanted props to pass to SVG <text /> element
    const { verticalAnchor, marketingInvestment, ...cleanProps } = this.props;
    console.log(cleanProps);
    const description = `${formatCurrencyShorthand(
      this.props.datum.investment
    )} (${formatPercent(
      Number(this.props.datum.investment) /
        Number(this.props.marketingInvestment)
    )})`;
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

export default class ProjectPage extends Component {
  // TODO: define propTypes, maybe? -Dave

  report() {
    // XXX TODO this is stupid.
    return this.props.reports.current_period;
  }

  renderPropertySection() {
    return (
      <ReportSection name="Property">
        <div className="flex -m-4">
          {/* Primary metric */}
          <div className="w-1/4 m-4">
            <PrimaryValueBox
              name="Leased"
              value={formatPercent(this.report().leased_rate)}
              help={
                <span>
                  {`${this.report().leased_units} of ${
                    this.report().leasable_units
                  } Leasable Units`}
                  <br />
                  {`Target ${
                    this.report().target_leased_units
                  } (${formatPercent(this.report().target_lease_percent)})`}
                </span>
              }
            />
          </div>

          {/* Secondary metrics flex -- the -m-4 we'd normally put here negates the m-4 for the box*/}
          <div className="flex flex-grow">
            <div className="w-1/5 m-4">
              <SecondaryValueBox
                name="Leases Executed"
                value={formatNumber(this.report().leases_executed)}
              />
            </div>
            <div className="w-1/5 m-4">
              <SecondaryValueBox
                name="Renewals"
                value={formatNumber(this.report().leases_renewed)}
              />
            </div>
            <div className="w-1/5 m-4">
              <SecondaryValueBox
                name="Leases Ended"
                value={formatNumber(this.report().leases_ended)}
              />
            </div>
            <div className="w-1/5 m-4">
              <SecondaryValueBox
                name="Net Lease Change"
                value={formatNumber(this.report().net_lease_change)}
              />
            </div>
          </div>
        </div>
      </ReportSection>
    );
  }

  renderResidentAcquisitionFunnelSection() {
    return (
      <ReportSection name="Resident Acquisition Funnel">
        <table className="k-report-table w-full" cellSpacing="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actual</th>
              <th>Converted</th>
              <th>Cost Per</th>
            </tr>
          </thead>
          <tbody>
            <tr className="k-rectangle">
              <th>Unique Website Visitors</th>
              <td>{formatNumber(this.report().usvs)}</td>
              <td>&nbsp;</td>
              <td>{formatCurrency(this.report().cost_per_usv, true)}</td>
            </tr>
            <tr className="k-rectangle">
              <th>Inquiries</th>
              <td>{formatNumber(this.report().inquiries)}</td>
              <td>
                {formatPercent(this.report().usvs_to_inquiries_percent, 1)}
              </td>
              <td>{formatCurrency(this.report().cost_per_inquiry, true)}</td>
            </tr>
            <tr className="k-rectangle">
              <th>Tours</th>
              <td>{formatNumber(this.report().tours)}</td>
              <td>
                {formatPercent(this.report().inquiries_to_tours_percent, 1)}
              </td>
              <td>{formatCurrency(this.report().cost_per_tour, true)}</td>
            </tr>
            <tr className="k-rectangle">
              <th>Lease Applications</th>
              <td>{formatNumber(this.report().lease_applications)}</td>
              <td>
                {formatPercent(
                  this.report().tours_to_lease_applications_percent,
                  1
                )}
              </td>
              <td>
                {formatCurrency(this.report().cost_per_lease_application, true)}
              </td>
            </tr>
            <tr className="k-rectangle">
              <th>Lease Executions</th>
              <td>{formatNumber(this.report().leases_executed)}</td>
              <td>
                {formatPercent(
                  this.report().lease_applications_to_leases_executed_percent,
                  1
                )}
              </td>
              <td>
                {formatCurrency(this.report().cost_per_lease_execution, true)}
              </td>
            </tr>
          </tbody>
        </table>
        {/* And away we go! */}
      </ReportSection>
    );
  }

  renderEstimatedMarketingInvestmentAndReturnSection() {
    const investmentData = [
      {
        category: "Reputation Building",
        investment: this.report().investment_reputation_building,
        color: "#4035f4"
      },
      {
        category: "Demand Creation",
        investment: this.report().investment_demand_creation,
        color: "#5147ff"
      },
      {
        category: "Leasing Enablement",
        investment: this.report().investment_leasing_enablement,
        color: "#867ffe"
      },
      {
        category: "Market Intelligence",
        investment: this.report().investment_market_intelligence,
        color: "#675efc"
      },
      {
        category: "Resident Retention",
        investment: this.report().investment_resident_retention,
        color: "#A09afd"
      }
    ];

    return (
      <ReportSection name="Estimated Marketing Investment And Return">
        <div className="flex -m-4">
          <div className="w-1/4 m-4">
            <PrimaryValueBox
              name="Invested"
              value={formatCurrencyShorthand(
                this.report().marketing_investment
              )}
            />
          </div>
          <div className="m-4 flex-grow h-96">
            <VictoryPie
              data={investmentData}
              innerRadius={100}
              labelComponent={
                <DonutLabel
                  marketingInvestment={this.report().marketing_investment}
                />
              }
              x="category"
              y="investment"
              style={{
                data: {
                  fill: datum => datum.color
                },
                labels: {
                  fontFamily: "formular",
                  fontWeight: "400",
                  fontSize: "1rem",
                  fill: "#cccccc"
                }
              }}
            />
          </div>
          <div className="w-1/4 m-4">
            <PrimaryValueBox
              name="ROMI"
              value={`${this.report().return_on_marketing_investment}x`}
              help={`Estimated annual revenue gain: ${formatCurrencyShorthand(
                this.report().estimated_annual_revenue_change
              )}`}
            />
          </div>
        </div>
      </ReportSection>
    );
  }

  render() {
    // TODO: actual rendering code goes here. -Dave
    return (
      <div className="page">
        <h1>Remarkably</h1>
        {this.renderPropertySection()}
        {this.renderResidentAcquisitionFunnelSection()}
        {this.renderEstimatedMarketingInvestmentAndReturnSection()}
      </div>
    );
  }
}
