import React, { Component } from "react";
import PropTypes from "prop-types";

import "./project_drop_down.scss";
import DEFAULT_BUILDING_IMAGE from "../../../images/remarkably-project-building-neutral.svg";

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
    project: PropTypes.object.isRequired
  };

  render() {
    const { name, building_image_thumbnail } = this.props.project;

    // For now, just render the name and a blank image.
    return (
      <div className="project-drop-down">
        <img
          className="project-drop-down__image"
          src={building_image_thumbnail || DEFAULT_BUILDING_IMAGE}
        />
        <span className="project-drop-down__text">{name}</span>
      </div>
    );
  }
}
