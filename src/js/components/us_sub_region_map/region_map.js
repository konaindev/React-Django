import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

class RegionMap extends React.PureComponent {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onMouseEnter: PropTypes.func.isRequired,
    usState: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  getStateClassName = state =>
    cn("us-sub-region-map__state", `us-sub-region-map__state--${state}`, {
      "us-sub-region-map__state--hover": this.props.usState === state,
      "us-sub-region-map__state--excluded": this.props.excludedStates.includes(
        state
      )
    });
}

export default RegionMap;
