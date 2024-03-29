import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import RMBTooltip from "../rmb_tooltip";

import MidwestRegionMap from "./midwest_region_map";
import WestRegionMap from "./west_region_map";
import SouthRegionMap from "./south_region_map";
import NorthEastRegionMap from "./north_east_region_map";

class USSubRegionMap extends React.Component {
  static propTypes = {
    region: PropTypes.string.isRequired,
    states: PropTypes.object.isRequired,
    excludedStates: PropTypes.arrayOf(PropTypes.string).isRequired,
    onIncludeState: PropTypes.func,
    onExcludeState: PropTypes.func
  };

  static defaultProps = {
    onExcludeState: () => {},
    onIncludeState: () => {}
  };

  static regions = {
    w: WestRegionMap,
    mw: MidwestRegionMap,
    s: SouthRegionMap,
    ne: NorthEastRegionMap
  };

  state = {
    usState: ""
  };

  get buttons() {
    const usState = this.state.usState;
    const link = this.props.states[usState];
    return (
      <div className="us-sub-region-map__tooltip">
        <div className="us-sub-region-map__button" onClick={this.toggleState}>
          {this.props.excludedStates.includes(usState)
            ? "Include State"
            : "Exclude State"}
        </div>
        <Link
          style={{ color: "inherit", textDecoration: "inherit" }}
          className="us-sub-region-map__button"
          to={link}
        >
          Expand Region
        </Link>
      </div>
    );
  }

  get align() {
    const tooltipAlign = USSubRegionMap.regions[this.props.region].tooltipAlign;
    return {
      offset: tooltipAlign[this.state.usState]
    };
  }

  toggleState = () => {
    const usState = this.state.usState;
    if (this.props.excludedStates.includes(usState)) {
      this.props.onIncludeState(usState);
    } else {
      this.props.onExcludeState(usState);
    }
  };

  onMouseEnterHandler = usState => this.setState({ usState });

  onMouseLeaveHandler = () => this.setState({ usState: "" });

  render() {
    const Region = USSubRegionMap.regions[this.props.region];
    const className = cn(
      "us-sub-region-map",
      `us-sub-region-map--${this.props.region}`,
      {
        "us-sub-region-map--hover": this.state.usState
      }
    );
    return (
      <div className={className} onMouseLeave={this.onMouseLeaveHandler}>
        <RMBTooltip
          placement="top"
          overlayStyle={{ opacity: 1 }}
          overlay={this.buttons}
          align={this.align}
          visible={!!this.state.usState}
        >
          <Region
            {...this.props}
            onMouseEnter={this.onMouseEnterHandler}
            usState={this.state.usState}
          />
        </RMBTooltip>
      </div>
    );
  }
}

export default USSubRegionMap;
