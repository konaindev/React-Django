import _isEmpty from "lodash/isEmpty";
import _isArray from "lodash/isArray";
import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import AddPropertyModal from "../add_property_modal";
import { states } from "../add_property_form/states";
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
    viewType: PropTypes.string,
    filters: PropTypes.object,
    onChangeFilter: PropTypes.func
  };

  static defaultProps = {
    selectedProperties: [],
    viewType: "tile",
    filters: {},
    onChangeFilter: () => {}
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
      selectedProperties: props.selectedProperties,
      isShowAddPropertyForm: false
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

  onShowAddPropertyForm = () => {
    this.setState({ isShowAddPropertyForm: true });
  };

  onHideAddPropertyForm = () => {
    this.setState({ isShowAddPropertyForm: false });
  };

  addPropertyFormProps = {
    packages: [
      { id: "accelerate", name: "Accelerate" },
      { id: "optimize", name: "Optimize" },
      { id: "ground", name: "Ground Up" },
      { id: "other", name: "Not Sure" }
    ],
    post_url: "/sales/new-project",
    onSuccess: this.onHideAddPropertyForm,
    states
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
                  {/* <ToggleButton
                    options={DashboardPage.buttonOptions}
                    value={this.state.viewType}
                    onChange={this.toggleView}
                  /> */}
                </div>
                <Button
                  className="dashboard-content__add-property"
                  color="primary"
                  uppercase={true}
                  onClick={this.onShowAddPropertyForm}
                >
                  ADD PROPERTY
                </Button>
              </div>
            </div>
            <div className="dashboard-content__controls">
              <div className="dashboard-content__filters">
                <DashboardControls
                  propertiesCount={this.props.properties.length}
                  funds={this.props.funds}
                  assetManagers={this.props.asset_managers}
                  propertyManagers={this.props.property_managers}
                  locations={this.props.locations}
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
          <AddPropertyModal
            open={this.state.isShowAddPropertyForm}
            formProps={this.addPropertyFormProps}
            onClose={this.onHideAddPropertyForm}
          />
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
    const urlParams = new URLSearchParams(window.location.search);
    this.filters = {
      q: urlParams.get("q"),
      ct: urlParams.getAll("ct"),
      st: urlParams.getAll("st"),
      fd: urlParams.getAll("fd"),
      am: urlParams.getAll("am"),
      pm: urlParams.getAll("pm")
    };
  }

  onChangeFilter = filters => {
    const urlParams = new URLSearchParams();
    Object.keys(filters).forEach(filterName => {
      const value = filters[filterName];
      if (!_isEmpty(value)) {
        if (_isArray(value)) {
          value.forEach(v => urlParams.append(filterName, v));
        } else {
          urlParams.set(filterName, value);
        }
      }
    });
    const searchStr = urlParams.toString();
    if (searchStr !== window.location.search) {
      window.location.search = searchStr;
    }
  };

  render() {
    if (_isEmpty(this.props.filters) && !this.props.properties.length) {
      return (
        <PageChrome>
          <div className="dashboard-content">
            <p>
              Please contact your Account Manager to setup access to your
              properties
            </p>
          </div>
        </PageChrome>
      );
    }
    return (
      <DashboardPage
        {...this.props}
        filters={this.filters}
        onChangeFilter={this.onChangeFilter}
      />
    );
  }
}
