import React from "react";
import { connect } from "react-redux";
import { props as sbProps } from "../../components/dashboard_page/props";
import { props as portProps } from "../../components/portfolio_analysis_view/props";
import {
  user as _user,
  properties as _properties,
  funds as _funds,
  property_managers as _pm,
  portfolio as _pf,
  asset_managers as _am,
  locations as _loc
} from "../../state/actions";

class DebugGate extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(sbProps);
    console.log(this.props);
    // if (process.env.LOAD_SB_PROPS === "YES") {
    const {
      user,
      property_managers,
      funds,
      properties,
      asset_managers,
      locations
    } = sbProps;
    this.props.dispatch(_user.set(user));
    this.props.dispatch(_properties.set(properties));
    this.props.dispatch(_funds.set(funds));
    this.props.dispatch(_pm.set(property_managers));
    this.props.dispatch(_pf.set(portProps));
    this.props.dispatch(_am.set(asset_managers));
    this.props.dispatch(_am.set(asset_managers));

    // }
  }
  render() {
    return this.props.children;
  }
}
export default connect()(DebugGate);
