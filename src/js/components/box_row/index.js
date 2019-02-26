import React, { Component } from "react";
import PropTypes from "prop-types";

import { equalWidthStyle } from "../../utils/style.js";

/**
 * @class BoxRow
 *
 * @classdesc A simple layout for a single row of boxes. Pass boxes as `children`.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
export default class BoxRow extends Component {
  static propTypes = { externalMargin: PropTypes.bool.isRequired };

  static defaultProps = { externalMargin: true };

  render() {
    const baseClassNames = "flex flex-row flex-grow items-stretch";
    const classNames = this.props.externalMargin
      ? `${baseClassNames} -m-4`
      : baseClassNames;

    return (
      <div className={classNames}>
        {this.props.children.map((child, i) => (
          <div
            key={i}
            className="m-4"
            style={equalWidthStyle(this.props.children.length)}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
}
