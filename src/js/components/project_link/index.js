import React from "react";

import "./project_link.scss";
import PropTypes from "prop-types";

import PropertyStatus from "../property_status";

const ProjectLink = ({ imageUrl, name, health, url }) => {
  const imageStyle = {
    backgroundImage: `url("${imageUrl}")`
  };

  return (
    <a className="project_link" href={url}>
      <div className="project_link__arrow" />
      <div style={imageStyle} className="project_link__image" />
      <div className="project_link__name">{name}</div>
      <PropertyStatus performance_rating={health} />
    </a>
  );
};

ProjectLink.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  health: PropertyStatus.type.healthType.isRequired,
  url: PropTypes.string.isRequired
};

export default ProjectLink;
