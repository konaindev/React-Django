import React, { Component } from "react";
import PropTypes from "prop-types";

import "./project_drop_down.scss";

/**
 * @class ProjectDropDown
 *
 * @classdesc A drop-down menu that lets customers select a different
 * project that they have access to.
 */
export default class ProjectDropDown extends Component {
  // TODO: eventually, this should take `current_project_link` and
  // `project_links`; that's a nice parallel to `current_report_link` and
  // `report_links`.
  static propTypes = {
    project: PropTypes.shape({
      name: PropTypes.string,
      building_logo: PropTypes.array
    }).isRequired
  };

  render() {
    const { name, building_logo } = this.props.project;

    let buildingLogoStyle = {};
    if (building_logo != null) {
      buildingLogoStyle["backgroundImage"] = `url(${building_logo[2]})`;
    }

    // For now, just render the name and a blank image.
    return (
      <div className="project-drop-down">
        <span className="project-drop-down__image" style={buildingLogoStyle} />
        <span className="project-drop-down__text">{name}</span>
      </div>
    );
  }
}
