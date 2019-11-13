import React from "react";
import { Link } from "react-router-dom";
import "./project_link.scss";
import PropTypes from "prop-types";

import PropertyStatus from "../property_status";

const ProjectLink = ({ imageUrl, name, health, url }) => {
  const imageStyle = {
    backgroundImage: `url("${imageUrl}")`
  };

  return (
    <Link className="project_link" to={url}>
      <div className="project_link__arrow" />
      <div className="project_link__image-default">
        <div style={imageStyle} className="project_link__image" />
      </div>
      <div className="project_link__name">{name}</div>
      <PropertyStatus performance_rating={health} />
    </Link>
  );
};

ProjectLink.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  health: PropertyStatus.type.healthType.isRequired,
  url: PropTypes.string.isRequired
};

export default ProjectLink;
