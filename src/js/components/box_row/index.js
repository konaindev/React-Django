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
  static propTypes = { externalMargin: PropTypes.bool.isRequired };

  static defaultProps = { externalMargin: true };

  render() {
    return (
      <div
        className={cn("box-row", {
          "external-margin": this.props.externalMargin
        })}
      >
        {this.props.children.map((child, i) => (
          <div
            key={i}
            className="child-wrapper"
            style={equalWidthStyle(this.props.children.length)}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
}
