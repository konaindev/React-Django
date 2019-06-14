import _get from "lodash/get";
import PropTypes from "prop-types";
import React from "react";

import MultiSelect from "../multi_select";
import SearchField from "../search_field";
import SortSelect from "../sort_select";

import "./dashboard_controls.scss";

export default class DashboardControls extends React.PureComponent {
  static sortOptions = [
    { label: "Recently Viewed", value: "recently" },
    { label: "By Property Mgr.", value: "propertyMgr" },
    { label: "By Asset Owner", value: "assetOwner" },
    { label: "By Region", value: "region" },
    { label: "By City", value: "city" },
    { label: "By Fund", value: "fund" },
    { label: "By performance", value: "performance" }
  ];

  static propTypes = {
    propertiesCount: PropTypes.number.isRequired,
    funds: PropTypes.array.isRequired,
    assetManagers: PropTypes.array.isRequired,
    propertyManagers: PropTypes.array.isRequired,
    locations: PropTypes.array.isRequired,
    sortOptions: PropTypes.array,
    filters: PropTypes.shape({
      q: PropTypes.string,
      ct: PropTypes.array,
      fd: PropTypes.array,
      am: PropTypes.array,
      pm: PropTypes.array
    }),
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    filters: { ct: [], fd: [], am: [], pm: [] },
    sortOptions: DashboardControls.sortOptions
  };

  static multiSelectStyle = {
    menu: provided => ({ ...provided, width: 320 })
  };

  constructor(props) {
    super(props);
    this.state = {
      filters: props.filters
    };
  }

  get fundsOptions() {
    return this.props.funds.map(fund => ({
      label: fund.label,
      value: fund.id
    }));
  }

  get assetOwnersOptions() {
    return this.props.assetManagers.map(assetManager => ({
      label: assetManager.label,
      value: assetManager.id
    }));
  }

  get propertyManagersOptions() {
    return this.props.propertyManagers.map(propertyManager => ({
      label: propertyManager.label,
      value: propertyManager.id
    }));
  }

  get locationsOptions() {
    return this.props.locations.map(location => ({
      label: location.label,
      value: location.value
    }));
  }

  getSelectedOptions = (options, name) => {
    const values = _get(this.state.filters, name, []);
    return options.filter(o => values.includes(o.value));
  };

  onChangeHandler = (options, field) => {
    const filters = { ...this.state.filters };
    filters[field.name] = options.map(o => o.value);
    this.setState({ filters });
  };

  onSearchHandler = searchText => {
    const filters = { ...this.state.filters };
    filters.q = searchText;
    this.setState({ filters }, () => {
      this.props.onChange(filters);
    });
  };

  onChangeFilter = () => {
    this.props.onChange(this.state.filters);
  };

  render() {
    const searchText = this.state.filters?.q;
    const locationsOptions = this.locationsOptions;
    const selectedLocations = this.getSelectedOptions(
      this.locationsOptions,
      "ct"
    );
    const fundsOptions = this.fundsOptions;
    const selectedFunds = this.getSelectedOptions(fundsOptions, "fd");
    const assetOwnersOptions = this.assetOwnersOptions;
    const selectedAssetManagers = this.getSelectedOptions(
      assetOwnersOptions,
      "am"
    );
    const propertyManagersOptions = this.propertyManagersOptions;
    const selectedPropertyManagers = this.getSelectedOptions(
      propertyManagersOptions,
      "pm"
    );
    return (
      <SearchField value={searchText} onSubmit={this.onSearchHandler}>
        <div className="dashboard-controls">
          <span className="dashboard-controls__title">
            {this.props.propertiesCount} Properties
          </span>
          <MultiSelect
            className="dashboard-controls__field"
            options={locationsOptions}
            value={selectedLocations}
            name="ct"
            styles={DashboardControls.multiSelectStyle}
            placeholder="Locations…"
            label="Locations…"
            onChange={this.onChangeHandler}
            onMenuClose={this.onChangeFilter}
          />
          <MultiSelect
            className="dashboard-controls__field"
            options={fundsOptions}
            value={selectedFunds}
            name="fd"
            styles={DashboardControls.multiSelectStyle}
            placeholder="Funds…"
            label="Funds…"
            selectAllLabel="ALL FUNDS"
            onChange={this.onChangeHandler}
            onMenuClose={this.onChangeFilter}
          />
          <MultiSelect
            className="dashboard-controls__field"
            options={assetOwnersOptions}
            value={selectedAssetManagers}
            name="am"
            styles={DashboardControls.multiSelectStyle}
            placeholder="Asset Owners…"
            label="Asset Owners…"
            selectAllLabel="ALL OWNERS"
            onChange={this.onChangeHandler}
            onMenuClose={this.onChangeFilter}
          />
          <MultiSelect
            className="dashboard-controls__field"
            options={propertyManagersOptions}
            value={selectedPropertyManagers}
            name="pm"
            styles={DashboardControls.multiSelectStyle}
            placeholder="Property Mgr…"
            label="Property Mgr…"
            selectAllLabel="ALL MANAGERS"
            onChange={this.onChangeHandler}
            onMenuClose={this.onChangeFilter}
          />
          <SortSelect
            className="dashboard-controls__sort"
            options={this.props.sortOptions}
            defaultValue={this.props.sortOptions[0]}
          />
        </div>
      </SearchField>
    );
  }
}
