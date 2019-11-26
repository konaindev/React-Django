import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Panel from "../panel";

import "./property_overview.scss";

export default class PropertyOverview extends React.PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    buildingImageURL: PropTypes.string.isRequired
  };

  render() {
    const { project, buildingImageURL } = this.props;
    const imageStyle = {};
    if (buildingImageURL) {
      imageStyle.backgroundImage = `url(${buildingImageURL})`;
    }
    const imageClass = cn("property-overview__image", {
      ["property-overview__image--default"]: !buildingImageURL
    });
    return (
      <div className="property-overview">
        <div className="property-overview__section property-overview__info">
          <Panel className="property-overview__info-panel">
            <div className="property-overview__section-header">
              {project.name}
            </div>
            <div className="property-overview__address">
              {project.address_str}
            </div>
          </Panel>
          <div className={imageClass} style={imageStyle} />
        </div>
      </div>
    );
  }
}
