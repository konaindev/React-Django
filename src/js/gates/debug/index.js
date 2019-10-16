import React from "react";
import { connect } from "react-redux";
import { props as sbProps } from "../../components/dashboard_page/props";
import { props as portProps } from "../../components/portfolio_analysis_view/props";
import { props as projProps } from "../../components/project_page/props";
import reportProps from "../../components/baseline_report_page/props";
import marketProps from "../../components/market_report_page/props";
import {
  user as _user,
  properties as _properties,
  funds as _funds,
  property_managers as _pm,
  portfolio as _pf,
  asset_managers as _am,
  locations as _loc,
  project as _proj,
  market as _market
} from "../../state/actions";

class DebugGate extends React.PureComponent {
  constructor(props) {
    super(props);
    // if (process.env.LOAD_SB_PROPS === "YES") {
    const {
      user,
      property_managers,
      funds,
      properties,
      asset_managers,
      locations
    } = sbProps;
    // load state from dashboard storybook props...
    //this.props.dispatch(_user.set(user));
    this.props.dispatch(_properties.set(properties));
    this.props.dispatch(_funds.set(funds));
    this.props.dispatch(_pm.set(property_managers));
    this.props.dispatch(_am.set(asset_managers));
    this.props.dispatch(_loc.set(locations));

    // load state from portfolio view sb props...
    this.props.dispatch(_pf.set(portProps));

    //load state from project page view sb props...
    this.props.dispatch(_proj.set(reportProps));
    //load state from market page sb props...
    this.props.dispatch(_market.set(marketProps));
    // }
  }
  render() {
    return this.props.children;
  }
}
export default connect()(DebugGate);
