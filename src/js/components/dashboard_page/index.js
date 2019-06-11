import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import Button from "../button";
import SortSelect from "../sort_select";
import ToggleButton from "../toggle_button";
import Container from "../container";
import PageChrome from "../page_chrome";
import PropertyCardList from "../property_card_list";
// import PropertyList from "../property_list";
import SearchField from "../search_field";
import MultiSelect from "../multi_select";
import { Close, ListView, TileView } from "../../icons";

import "./dashboard_page.scss";

export default class DashboardPage extends React.PureComponent {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    funds: PropTypes.array.isRequired,
    asset_managers: PropTypes.array.isRequired,
    property_managers: PropTypes.array.isRequired,
    selectedProperties: PropTypes.arrayOf(PropTypes.string),
    viewType: PropTypes.string
  };

  static defaultProps = {
    selectedProperties: [],
    viewType: "tile"
  };

  static buttonOptions = [
    {
      id: "list",
      icon: ListView
    },
    {
      id: "tile",
      icon: TileView
    }
  ];

  static sortOptions = [
    { label: "Recently Viewed", value: "recently" },
    { label: "By Property Mgr.", value: "propertyMgr" },
    { label: "By Asset Owner", value: "assetOwner" },
    { label: "By Region", value: "region" },
    { label: "By City", value: "city" },
    { label: "By Fund", value: "fund" },
    { label: "By performance", value: "performance" }
  ];

  constructor(props) {
    super(props);
    this.state = {
      viewType: props.viewType,
      selectedProperties: props.selectedProperties
    };
    this.urlParams = new URLSearchParams(window.location.search);
  }

  selectAll = () => {
    const selectedProperties = this.props.properties.map(p => p.property_id);
    this.setState({ selectedProperties });
  };

  cancelSelect = () => {
    this.setState({ selectedProperties: [] });
  };

  get propertiesListComponent() {
    if (this.state.viewType === "tile") {
      return PropertyCardList;
    } else {
      // return PropertyList;
      return "PropertyList";
    }
  }

  get fundsOptions() {
    return this.props.funds.map(fund => ({
      label: fund.label,
      value: fund.id
    }));
  }

  get assetOwnersOptions() {
    return this.props.asset_managers.map(am => ({
      label: am.label,
      value: am.id
    }));
  }
  get propertyManagersOptions() {
    return this.props.property_managers.map(am => ({
      label: am.label,
      value: am.id
    }));
  }

  get locationsOptions() {
    return this.props.states.map(am => ({
      label: am.label,
      value: am.value
    }));
  }

  onSearchHandler = searchText => {
    const oldSearchText = this.urlParams.get("q") || "";
    if (searchText) {
      this.urlParams.set("q", searchText);
    } else {
      this.urlParams.delete("q");
    }
    if (oldSearchText !== searchText) {
      window.location.search = this.urlParams.toString();
    }
  };

  render() {
    const className = cn("dashboard-content", {
      "dashboard-content--selection-mode": this.state.selectedProperties.length
    });
    const PropertiesListComponent = this.propertiesListComponent;
    return (
      <PageChrome>
        <div className={className}>
          <Container>
            <div className="dashboard-content__title">
              <div className="dashboard-content__title-right">
                <div className="dashboard-content__select-view">
                  <ToggleButton
                    options={DashboardPage.buttonOptions}
                    value={this.state.viewType}
                    onChange={viewType => this.setState({ viewType })}
                  />
                </div>
                <Button color="primary">Add Property</Button>
              </div>
            </div>
            <div className="dashboard-content__controls">
              <div className="dashboard-content__filters">
                <DashboardControls
                  properties={this.props.properties}
                  searchText={this.urlParams.get("q")}
                  fundsOptions={this.fundsOptions}
                  assetOwnersOptions={this.assetOwnersOptions}
                  propertyManagersOptions={this.propertyManagersOptions}
                  locationsOptions={this.locationsOptions}
                  onSubmit={this.onSearchHandler}
                />
              </div>
              <div className="dashboard-content__selection">
                <DashboardSelection
                  selectedProperties={this.state.selectedProperties}
                  selectAll={this.selectAll}
                  cancelSelect={this.cancelSelect}
                />
              </div>
            </div>
            <PropertiesListComponent
              properties={this.props.properties}
              selectedProperties={this.state.selectedProperties}
              onSelect={selectedProperties => {
                this.setState({ selectedProperties });
              }}
            />
          </Container>
        </div>
      </PageChrome>
    );
  }
}

const DashboardSelection = ({
  selectedProperties,
  selectAll,
  cancelSelect
}) => {
  return (
    <div className="dashboard-selection">
      <div className="dashboard-selection__title">
        {selectedProperties.length} Properties Selected
      </div>
      <div className="dashboard-selection__controls">
        <Button className="dashboard-selection__button" color="transparent">
          INVITE
        </Button>
        <Button
          className="dashboard-selection__button"
          color="transparent"
          onClick={selectAll}
        >
          SELECT ALL
        </Button>
        <Button
          className="dashboard-selection__button"
          color="transparent"
          onClick={cancelSelect}
        >
          CANCEL
          <Close className="dashboard-selection__button-icon" width={9} />
        </Button>
      </div>
    </div>
  );
};

DashboardSelection.propTypes = {
  selectedProperties: PropTypes.array.isRequired
};

const DashboardControls = ({
  properties,
  searchText,
  onSubmit,
  fundsOptions,
  assetOwnersOptions,
  propertyManagersOptions,
  locationsOptions
}) => {
  return (
    <SearchField onSubmit={onSubmit} value={searchText}>
      <div className="dashboard-controls">
        <span className="dashboard-controls__title">
          {properties.length} Properties
        </span>
        <MultiSelect
          className="dashboard-controls__field"
          options={locationsOptions}
          styles={{
            menu: provided => ({ ...provided, width: 320 })
          }}
          placeholder="Locations…"
        />
        <MultiSelect
          className="dashboard-controls__field"
          options={fundsOptions}
          styles={{
            menu: provided => ({ ...provided, width: 320 })
          }}
          placeholder="Funds…"
        />
        <MultiSelect
          className="dashboard-controls__field"
          options={assetOwnersOptions}
          styles={{
            menu: provided => ({ ...provided, width: 320 })
          }}
          placeholder="Asset Owners…"
        />
        <MultiSelect
          className="dashboard-controls__field"
          options={propertyManagersOptions}
          styles={{
            menu: provided => ({ ...provided, width: 320 })
          }}
          placeholder="Property Mgr…"
        />
        <SortSelect
          className="dashboard-controls__sort"
          options={DashboardPage.sortOptions}
          defaultValue={DashboardPage.sortOptions[0]}
          onChange={() => {}}
          onReverse={() => {}}
        />
      </div>
    </SearchField>
  );
};

DashboardControls.propTypes = {
  properties: PropTypes.array.isRequired
};
