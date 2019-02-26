import React from "react";
import PropTypes from "prop-types";

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
          <div key={i} className="flex flex-col">
            {child}
          </div>
        ))}
      </>
    );
  }
}
