import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import ButtonLink from "../button_link";
import Panel from "../panel";

import ItemPanel from "./item_panel";

import "./property_overview.scss";

export default class PropertyOverview extends React.PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    buildingImageURL: PropTypes.string.isRequired
  };

  static characteristicsFields = {
    building_class: "class",
    year_built: "year built",
    year_renovated: "year renovated",
    total_units: "number of units",
    property_type: "type",
    property_style: "style"
  };

  static stakeholdersFields = {
    property_owner: "owner",
    asset_manager: "asset manager",
    property_manager: "property manager",
    developer: "developer"
  };

  _renderFields = (fields, colsNum, emptyMessage) => {
    const { project } = this.props;
    const items = [];

    for (let f of Object.keys(fields)) {
      if (!!project[f]) {
        items.push({ name: fields[f], value: project[f] });
      }
    }

    if (!items.length) {
      return (
        <div className="property-overview__section-empty">{emptyMessage}</div>
      );
    }

    return (
      <div
        className={`property-overview__section-content property-overview__section-content--${colsNum}-cols`}
      >
        {items.map(i => (
          <ItemPanel {...i} key={i.name} />
        ))}
      </div>
    );
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

  renderCharacteristics = () =>
    this._renderFields(
      PropertyOverview.characteristicsFields,
      3,
      "No Characteristics to show"
    );

  renderStakeholders = () =>
    this._renderFields(
      PropertyOverview.stakeholdersFields,
      2,
      "No Stakeholders to show"
    );

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
          {this.renderCharacteristics()}
        </div>
        <div className="property-overview__section">
          <div className="property-overview__section-header">Stakeholders</div>
          {this.renderStakeholders()}
        </div>
      </div>
    );
  }
}
