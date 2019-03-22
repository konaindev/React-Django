import React, { Component } from "react";
import PropTypes from "prop-types";

import "./breadcrumbs.scss";

export class Breadcrumbs extends Component {
  static propTypes = {
    breadcrumbs: PropTypes.arrayOf({
      text: PropTypes.string,
      link: PropTypes.string
    }).isRequired
  };

  render() {
    const { breadcrumbs } = this.props;

    return (
      <div className="breadcrumbs">
        {breadcrumbs.map((item, index) => (
          <span className="breadcrumbs__item">
            {item.link ? <a href={item.link}>{item.text}</a> : item.text}
          </span>
        ))}
      </div>
    );
  }
}

export default Breadcrumbs;
