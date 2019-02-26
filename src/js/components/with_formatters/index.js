import React, { Component } from "react";
import PropTypes from "prop-types";

import { targetFormatter } from '../../utils/formatters';

/**
 * @description Wraps an arbitrary Box Component with desired formatting,
 * including formatting for the primary value, the target, and any deltas.
 *
 * @note This is where layout and semantics are tied together;
 * unless you have custom needs, you'll probably want to use one of the
 * *Box components defined using `withFormatters(...)`, below.
 */
const withFormatters = (WrappedComponent, formatter, deltaFormatter = null) => {
  const formatterForTarget = targetFormatter(formatter);
  const formatterForDelta = deltaFormatter || formatter;

  return class extends React.Component {
    render() {
      let { value, target, delta, reverseArrow, ...remaining } = this.props;
      const content = DeltaLayout.build(
        value,
        delta,
        formatter,
        formatterForDelta,
        reverseArrow
      );

      return (
        <WrappedComponent
          content={content}
          detail={formatterForTarget(target)}
          {...remaining}
        />
      );
    }
  };
};

export default withFormatters;
