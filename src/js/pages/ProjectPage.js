import React, { Component } from "react";
import PropTypes from "prop-types";

const formatPercent = p => {
  return `${p * 100}%`;
};

const VALUE_BOX_PROP_TYPES = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  help: PropTypes.string
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
                value={this.report().leases_executed}
              />
            </div>
            <div className="w-1/5 m-4">
              <SecondaryValueBox
                name="Renewals"
                value={this.report().leases_renewed}
              />
            </div>
            <div className="w-1/5 m-4">
              <SecondaryValueBox
                name="Leases Ended"
                value={this.report().leases_ended}
              />
            </div>
            <div className="w-1/5 m-4">
              <SecondaryValueBox
                name="Net Lease Change"
                value={this.report().net_lease_change}
              />
            </div>
          </div>
        </div>
      </ReportSection>
    );
  }

  renderResidentAcquisitionFunnelSection() {}

  render() {
    // TODO: actual rendering code goes here. -Dave
    return (
      <div className="page">
        <h1>Remarkably</h1>
        {this.renderPropertySection()}
        {this.renderResidentAcquisitionFunnelSection()}
      </div>
    );
  }
}
