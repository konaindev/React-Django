import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ButtonLink from "../button_link";
import Panel from "../panel";

import AddTagField from "../../containers/add_tag_field";

import Tag from "./tag";
import Tile from "./tile";
import "./property_overview.scss";

export default class PropertyOverview extends React.PureComponent {
  static propTypes = {
    project: PropTypes.object.isRequired,
    buildingImageURL: PropTypes.string.isRequired,
    onRemoveTag: PropTypes.func
  };
  static defaultProps = {
    onRemoveTag() {}
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
        className={`property-overview__tiles property-overview__tiles--${colsNum}-cols`}
      >
        {items.map(i => (
          <Tile {...i} key={i.name} />
        ))}
      </div>
    );
  };

  renderTags = () => {
    const { project } = this.props;
    if (
      !project.is_admin &&
      (!project.custom_tags || !project.custom_tags.length)
    ) {
      return;
    }
    const customTags = project.custom_tags || [];
    const tags = customTags.map(name => (
      <Tag
        name={name}
        isAdmin={project.is_admin}
        onRemove={this.props.onRemoveTag}
        key={name}
      />
    ));
    let message = "Custom property groups are made for each tag.";
    if (project.is_admin) {
      message = "Create custom property groups by adding a tag.";
      tags.push(
        <AddTagField
          className="property-overview__add-tag-input"
          key="add-tag-input"
        />
      );
    }
    return (
      <div className="property-overview__section property-overview__section--top">
        <div className="property-overview__section-text">{message}</div>
        <div className="property-overview__tags">{tags}</div>
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
        {this.renderTags()}
        <div className="property-overview__section property-overview__section--top property-overview__info">
          <Panel className="property-overview__tile property-overview__tile--info">
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
