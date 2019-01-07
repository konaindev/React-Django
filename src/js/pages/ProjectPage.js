import React, { Component } from "react";
import PropTypes from "prop-types";

class ValueBox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    helpText: PropTypes.string
  };

  render() {
    return (
      <div className="bg-remark-ui-dark flex flex-row rounded-lg p-6">
        {/* Container for the value itself */}
        <div className="text-5xl w-1/4 text-center flex-none leading-none">
          <span className="text-remark-ui-text-lightest">
            {this.props.value}
          </span>
        </div>
        {/* Container for the label and help text */}
        <div className="flex flex-col flex-auto justify-between">
          <span className="text-remark-ui-text-light text-base">
            {this.props.name}
          </span>
          <span className="text-remark-ui-text text-sm">
            {this.props.helpText}
          </span>
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
    // TODO
  }
}

export default class ProjectPage extends Component {
  // TODO: define propTypes, maybe? -Dave

  render() {
    // TODO: actual rendering code goes here. -Dave
    return (
      <div className="page">
        <h1>Remarkably</h1>
        <div className="w-1/4">
          <ValueBox name="Leases Executed" value="6" helpText="Target: 9" />
        </div>
      </div>
    );
  }
}
