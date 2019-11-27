import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import ButtonLink from "../button_link";
import Panel from "../panel";

import "./property_overview.scss";

export default class PropertyOverview extends React.PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    buildingImageURL: PropTypes.string.isRequired
  };

  renderSiteLink = () => {
    const { project } = this.props;
    if (!project.url) {
      return (
        <div className="property-overview__site-empty">No website URL</div>
      );
    }
    return (
      <ButtonLink
        className="property-overview__site-link"
        link={project.url}
        target="_blank"
      />
    );
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
          <Panel className="property-overview__panel property-overview__panel--info">
            <div className="property-overview__section-header">
              {project.name}
            </div>
            <div className="property-overview__address">
              {project.address_str}
            </div>
            <div className="property-overview__site">
              {this.renderSiteLink()}
            </div>
          </Panel>
          <div className={imageClass} style={imageStyle} />
        </div>
        <div className="property-overview__section">
          <div className="property-overview__section-header">
            Characteristics
          </div>
        </div>
        <div className="property-overview__section">
          <div className="property-overview__section-header">Stakeholders</div>
        </div>
      </div>
    );
  }
}
