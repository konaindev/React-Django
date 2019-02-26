import React from "react";
import PropTypes from "prop-types";

/**
 * @class BoxTable
 *
 * @classdesc A wrapper layout when multiple BoxRows are used.
 *
 * @note For now, this is a no-op that simply renders its children; in the
 * future, it could demand that each child is a `BoxRow` and wrap them
 * as desired.
 */
export default class BoxTable extends Component {
  render() {
    return <>{this.props.children}</>;
  }
}
