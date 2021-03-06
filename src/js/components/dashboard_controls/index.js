import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import _get from "lodash/get";

import MultiSelect from "../multi_select";
import SearchField from "../search_field";
import GroupSelect from "../group_select";
import SortSelect from "../sort_select";

import { regions } from "./regions";
import "./dashboard_controls.scss";

export default class DashboardControls extends React.PureComponent {
  static sortOptions = [
    { label: "By Name", value: "name" },
    { label: "By Property Mgr.", value: "propertyMgr" },
    { label: "By Asset Owner", value: "assetOwner" },
    { label: "By State", value: "state" },
    { label: "By City", value: "city" },
    { label: "By Fund", value: "fund" },
    { label: "By Performance", value: "performance" }
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
      st: PropTypes.array,
      fd: PropTypes.array,
      am: PropTypes.array,
      pm: PropTypes.array,
      s: PropTypes.string,
      d: PropTypes.oneOf(["asc", "desc"])
    }),
    onChange: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool
  };

  static defaultProps = {
    filters: { ct: [], fd: [], am: [], pm: [] },
    sortOptions: DashboardControls.sortOptions,
    isDisabled: false,
    captionClicked: false
  };

  static multiSelectStyle = {
    menu: provided => ({ ...provided, width: 320 })
  };

  constructor(props) {
    super(props);
    this.state = {
      filters: props.filters,
      captionClicked: props.captionClicked
    };
    this.captionSearchToggle = this.captionSearchToggle.bind(this);
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
    return regions
      .map(r => ({
        label: r.name,
        options: this.props.locations
          .filter(location => r.states.includes(location.state))
          .map(location => ({
            label: location.label,
            city: location.city,
            state: location.state,
            value: location.label
          }))
      }))
      .filter(region => region.options.length);
  }

  getSelectedOptions = (options, name) => {
    const values = _get(this.state.filters, name, []);
    return options.filter(o => values.includes(o.value));
  };

  getSelectedLocationsOptions = options => {
    const cities = _get(this.state.filters, "ct", []);
    const states = _get(this.state.filters, "st", []);
    return options
      .reduce((acc, o) => [...acc, ...o.options], [])
      .filter(o => cities.includes(o.city) && states.includes(o.state));
  };

  onChangeLocation = options => {
    const filters = { ...this.state.filters };
    filters.ct = [...new Set(options.map(o => o.city))];
    filters.st = [...new Set(options.map(o => o.state))];
    this.setState({ filters });
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

  onChangeSort = (value, direction) => {
    const filters = {
      ...this.state.filters,
      s: value,
      d: direction
    };
    this.setState({ filters }, () => {
      this.props.onChange(filters);
    });
  };

  captionSearchToggle = () => {
    this.setState({ captionClicked: !this.state.captionClicked });
  };

  render() {
    const searchText = this.state.filters?.q;
    const locationsOptions = this.locationsOptions;
    const selectedLocations = this.getSelectedLocationsOptions(
      this.locationsOptions
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
    const sort = this.props.filters.s || this.props.sortOptions[0].value;
    const classes = cn("dashboard-controls", {
      "dashboard-controls--disable": this.props.isDisabled
    });
    return (
      <SearchField
        className={classes}
        value={searchText}
        onSubmit={this.onSearchHandler}
        captionClicked={this.state.captionClicked}
        captionSearchToggle={this.captionSearchToggle}
      >
        <div className="dashboard-controls__filters">
          <span
            className="dashboard-controls__title"
            onClick={this.captionSearchToggle}
          >
            {this.props.propertiesCount} Properties
          </span>
          <GroupSelect
            className="dashboard-controls__field"
            options={locationsOptions}
            value={selectedLocations}
            placeholder="Locations…"
            label="Locations…"
            selectAllLabel="ALL LOCATIONS"
            onChange={this.onChangeLocation}
            onApply={this.onChangeFilter}
            isDisabled={this.props.isDisabled}
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
            onApply={this.onChangeFilter}
            isDisabled={this.props.isDisabled}
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
            onApply={this.onChangeFilter}
            isDisabled={this.props.isDisabled}
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
            onApply={this.onChangeFilter}
            isDisabled={this.props.isDisabled}
          />
          <SortSelect
            className="dashboard-controls__sort"
            options={this.props.sortOptions}
            value={sort}
            direction={this.props.filters.d}
            onChange={this.onChangeSort}
            isDisabled={this.props.isDisabled}
          />
        </div>
      </SearchField>
    );
  }
}
