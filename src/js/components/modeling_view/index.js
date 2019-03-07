import React, { Component } from "react";
import PropTypes from "prop-types";

import CommonReport from "../common_report";
import Container from "../container";
import SectionHeader from "../section_header";
import ButtonGroup from "../button_group";
import "./modeling_view.scss";

export default class ModelingView extends Component {
  static propTypes = { report: PropTypes.object.isRequired };

  buttonGroupProps() {
    return {
      value: "investment-driven",
      options: [
        {
          value: "schedule-driven",
          label: "Schedule Driven"
        },
        {
          value: "investment-driven",
          label: "Investment Driven"
        },
        {
          value: "run-rate",
          label: "Run Rate"
        },
        {
          value: "compare-models",
          label: "Compare Models"
        }
      ]
    };
  }

  activeView() {
    return <CommonReport report={this.props.options[0]} />;
  }

  onClick(value) {
    this.setState("selectedView", value);
  }

  render() {
    return (
      <Container>
        <ButtonGroup
          {...this.buttonGroupProps()}
          onClick={this.onClick.bind(this)}
        />

        {this.activeView()}
      </Container>
    );
  }
}
