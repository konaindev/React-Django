import React, { Component } from "react";

import DeltaLayout from "../delta_layout";
import { targetFormatter } from "../../utils/formatters";

/**
 * @description Wraps an arbitrary Box Component with desired formatting,
 * including formatting for the primary value, the target, and any deltas.
 *
 * @note This is where layout and semantics are tied together;
 * unless you have custom needs, you'll probably want to use one of the
 * *Box components defined using `withFormatters(...)`, below.
 */
const withFormatters = (
  WrappedComponent,
  formatter,
  deltaFormatter = null,
  getDeltaDirection = null
) => {
  const formatterForTarget = targetFormatter(formatter);
  const formatterForDelta = deltaFormatter || formatter;

  class WithFormatters extends Component {
    render() {
      let {
        value,
        target,
        delta,
        reverseArrow,
        symbolType,
        getDeltaDirection,
        ...remaining
      } = this.props;

      const content = DeltaLayout.build(
        value,
        delta,
        formatter,
        formatterForDelta,
        reverseArrow,
        symbolType,
        getDeltaDirection
      );

      return (
        <WrappedComponent
          content={content}
          detail={formatterForTarget(target)}
          {...remaining}
        />
      );
    }
  }

  WithFormatters.displayName = `WithFormatters(${getDisplayName(
    WrappedComponent
  )})`;

  return WithFormatters;
};

export default withFormatters;

export const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || "Component";
