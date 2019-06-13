import _isEmpty from "lodash/isEmpty";
import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import Button from "../button";
import DashboardControls from "../dashboard_controls";
import ToggleButton from "../toggle_button";
import Container from "../container";
import PageChrome from "../page_chrome";
import PropertyCardList from "../property_card_list";
import PropertyList from "../property_list";
import { Close, ListView, TileView } from "../../icons";

import "./dashboard_page.scss";

export class DashboardPage extends React.PureComponent {
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

  constructor(props) {
    super(props);
    this.state = {
      viewType: props.viewType,
      selectedProperties: props.selectedProperties
    };
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
      return PropertyList;
    }
  }

  onChangeFilter = filters => {
    this.props.onChangeFilter(filters);
  };

  toggleView = viewType => this.setState({ viewType });

  onSelectHandler = selectedProperties => {
    this.setState({ selectedProperties });
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
                    onChange={this.toggleView}
                  />
                </div>
                <Button color="primary">Add Property</Button>
              </div>
            </div>
            <div className="dashboard-content__controls">
              <div className="dashboard-content__filters">
                <DashboardControls
                  propertiesCount={this.props.properties.length}
                  funds={this.props.funds}
                  assetManagers={this.props.asset_managers}
                  propertyManagers={this.props.property_managers}
                  locations={this.props.states}
                  filters={this.props.filters}
                  onChange={this.onChangeFilter}
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
              onSelect={this.onSelectHandler}
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

export default class UrlQueryLayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.filters = {};
    this.urlParams = new URLSearchParams(window.location.search);
    this.urlParams.forEach((value, name) => {
      this.filters[name] = value;
    });
  }

  onChangeFilter = filters => {
    console.log("onChangeFilter");
    Object.keys(filters).forEach(filterName => {
      const value = filters[filterName];
      if (_isEmpty(value)) {
        this.urlParams.delete(filterName);
      } else {
        this.urlParams.set(filterName, value);
      }
    });
    const searchStr = this.urlParams.toString();
    if (searchStr !== window.location.search) {
      window.location.search = searchStr;
    }
  };

  render() {
    return (
      <DashboardPage
        {...this.props}
        filters={this.filters}
        onChangeFilter={this.onChangeFilter}
      />
    );
  }
}
