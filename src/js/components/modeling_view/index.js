import React, { Component } from "react";
import PropTypes from "prop-types";

import ButtonGroup from "../button_group";
import Container from "../container";
import Header from "../header";
import CommonReport from "../common_report";
import ProjectTabs from "../project_tabs";
import { NavigationItems, ProjectNavigationItem } from "../navigation";
import "./modeling_view.scss";

export class ModelingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeReport: 0
    };
  }

  handleSetActiveReport = index => {
    this.setState({ activeReport: index });
  };

  render() {
    const { property_name, options } = this.props;
    const { activeReport } = this.state;

    const navigationItems = (
      <NavigationItems>
        <ProjectNavigationItem
          project={{ project: this.props.property_name }}
        />
      </NavigationItems>
    );

    const subnavOptions = options.map((report, index) => ({
      label: report.name,
      value: index
    }));

    return (
      <div className="page modeling-view">
        <Container>
          <div className="modeling-view__subnav">
            <ButtonGroup
              onChange={this.handleSetActiveReport}
              value={activeReport}
              options={subnavOptions}
            />
          </div>
        </Container>
        <CommonReport report={options[activeReport]} />
      </div>
    );
  }
}

export default ModelingView;
