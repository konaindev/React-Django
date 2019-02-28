import React, { Component } from "react";
import PropTypes from "prop-types";

import "./box_column.scss";

/**
 * @class BoxColumn
 *
 * @classdesc A special-purpose layout placing a column of boxes downward.
 */
export default class BoxColumn extends Component {
  static propTypes = {};

  render() {
    return (
      <>
        {this.props.children.map((child, i) => (
          <div key={i} className="box-column__child-wrapper">
            {child}
          </div>
        ))}
      </>
    );
  }
}
