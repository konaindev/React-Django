import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { equalWidthStyle } from "../../utils/style.js";
import "./box_row.scss";

/**
 * @class BoxRow
 *
 * @classdesc A simple layout for a single row of boxes. Pass boxes as `children`.
 *
 * @note This provides layout; it shouldn't concern itself with value semantics.
 */
export default class BoxRow extends Component {
  // TODO XXX FIXME externalMargin looks like a hack to me. -Dave
  static propTypes = {
    spacing: PropTypes.oneOf(["none", "normal", "wide"]).isRequired
  };

  static defaultProps = {
    spacing: "normal"
  };

  render() {
    const { children, spacing } = this.props;
    return (
      <div className={cn("box-row", `box-row--${spacing}`)}>
        {children.map((child, i) => (
          <div
            key={i}
            className="child-wrapper"
            style={equalWidthStyle(children.length)}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
}
