import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import AddPropertyModal from "../add_property_modal";
import { states } from "../add_property_form/states";
import Button from "../button";
import DashboardControls from "../dashboard_controls";
import Container from "../container";
import PropertyCardList from "../property_card_list";
import PropertyList from "../property_list";
import ToggleButton from "../toggle_button";
import { InviteModalProperties } from "../../containers/invite_modal";
import { Close, ListView, TileView } from "../../icons";
import Loader from "../loader";
import TutorialView from "../tutorial_view";
import { inviteModal, dashboard } from "../../redux_base/actions";
import "./dashboard_page.scss";

export class DashboardPage extends React.PureComponent {
  static propTypes = {
    fetchingProperties: PropTypes.bool.isRequired,
    properties: PropTypes.array.isRequired,
    funds: PropTypes.array.isRequired,
    asset_managers: PropTypes.array.isRequired,
    property_managers: PropTypes.array.isRequired,
    selectedProperties: PropTypes.array.isRequired,
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

  /*
    showLoader (called in componentDidUpdate):
      This was a hacky fix a spinner issue (lag between when data was available and when 'isFetching' is set to false resulting in prior page displaying before re-render); 
      showLoader represents a delayed replica of is (waits 300 ms before updating component)
  */
  constructor(props) {
    super(props);
    this.state = {
      viewType: props.viewType,
      isShowAddPropertyForm: false
    };
  }

  selectAll = () => {
    const selectedProperties = this.props.properties;
    this.props.dispatch(dashboard.updateStore({ selectedProperties }));
  };

  cancelSelect = () => {
    this.props.dispatch(dashboard.updateStore({ selectedProperties: [] }));
  };

  inviteHandler = () => {
    this.props.dispatch(inviteModal.open);
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
    let isAdmin;
    if (this.props.user.is_superuser) {
      isAdmin = true;
    } else {
      isAdmin = selectedProperties.every(property => {
        const member = property.members.find(
          m => m.user_id === this.props.user.user_id
        );
        return member?.role === "admin";
      });
    }
    const inviteDisable = !isAdmin;
    this.props.dispatch(
      dashboard.updateStore({ selectedProperties, inviteDisable })
    );
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
      "dashboard-content--selection-mode": this.props.selectedProperties.length
    });
    const PropertiesListComponent = this.propertiesListComponent;
    const { fetchingProperties } = this.props;
    return (
      <div>
        <TutorialView />
        <InviteModalProperties />
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
                <Button
                  className="dashboard-content__add-property"
                  color="primary"
                  uppercase={true}
                  onClick={this.onShowAddPropertyForm}
                  disabled={fetchingProperties}
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
                  isDisabled={fetchingProperties}
                  dispatch={this.props.dispatch}
                />
              </div>
              <div className="dashboard-content__selection">
                <DashboardSelection
                  selectedProperties={this.props.selectedProperties}
                  inviteDisable={this.props.inviteDisable}
                  inviteHandler={this.inviteHandler}
                  selectAll={this.selectAll}
                  cancelSelect={this.cancelSelect}
                />
              </div>
            </div>
            <div className="dashboard-content__properties">
              <Loader isVisible={fetchingProperties} />
              <PropertiesListComponent
                properties={this.props.properties}
                selectedProperties={this.props.selectedProperties}
                onSelect={this.onSelectHandler}
                disableSelection={true}
              />
            </div>
          </Container>
          <AddPropertyModal
            open={this.state.isShowAddPropertyForm}
            formProps={this.addPropertyFormProps}
            onClose={this.onHideAddPropertyForm}
          />
        </div>
      </div>
    );
  }
}

const DashboardSelection = ({
  selectedProperties,
  inviteHandler,
  inviteDisable,
  selectAll,
  cancelSelect
}) => {
  const inviteColor = inviteDisable ? "disabled" : "secondary";
  const controlsClasses = cn("dashboard-selection__controls", {
    "dashboard-selection__controls--invite-error": inviteDisable
  });
  return (
    <div className="dashboard-selection">
      <div className="dashboard-selection__title">
        {selectedProperties.length}
        {selectedProperties.length === 1 ? " Property" : " Properties"} Selected
      </div>
      <div className={controlsClasses}>
        <div className="dashboard-selection__invite-error">
          Some of the properties selected require admin access to invite users.
        </div>
        <Button.DisableWrapper
          className="dashboard-selection__button"
          isDisable={inviteDisable}
        >
          <Button
            className="dashboard-selection__button"
            color={inviteColor}
            onClick={inviteHandler}
          >
            invite
          </Button>
        </Button.DisableWrapper>
        <Button
          className="dashboard-selection__button"
          color="secondary"
          onClick={selectAll}
        >
          select all
        </Button>
        <Button
          className="dashboard-selection__button"
          color="secondary"
          onClick={cancelSelect}
        >
          cancel
          <Close className="dashboard-selection__button-icon" width={9} />
        </Button>
      </div>
    </div>
  );
};

DashboardSelection.propTypes = {
  selectedProperties: PropTypes.array.isRequired,
  inviteHandler: PropTypes.func.isRequired,
  inviteDisable: PropTypes.bool,
  selectAll: PropTypes.func.isRequired,
  cancelSelect: PropTypes.func.isRequired
};

DashboardSelection.defaultProps = {
  inviteDisable: true
};

export class UrlQueryLayer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.loadQueryString();
  }

  loadQueryString = () => {
    const filterNames = ["q", "ct", "st", "fd", "am", "pm", "s", "d"];
    const stringFilters = ["q", "s", "d"];
    const urlParams = qsParse(window.location.search);

    this.filters = {};
    Object.keys(urlParams).forEach(k => {
      const value = urlParams[k];

      if (!filterNames.includes(k) || _isEmpty(value)) {
        return;
      }

      if (!stringFilters.includes(k) && !_isArray(value)) {
        this.filters[k] = [value];
      } else {
        this.filters[k] = value;
      }
    });

    this.state = { ...this.filters };
  };

  onChangeFilter = filters => {
    if (_isEqual(filters, this.filters)) {
      return;
    }

    this.setState(filters);

    let urlParams = {};
    Object.keys(filters).forEach(k => {
      const value = filters[k];
      if (!_isEmpty(value)) {
        urlParams[k] = value;
      }
    });

    let queryString = qsStringify(urlParams);

    this.props.history.push(queryString);
    this.props.dispatch(dashboard.requestProperties(queryString));
  };

  render() {
    const { fetchingProperties, no_projects } = this.props;

    if (no_projects === false) {
      return (
        <DashboardPage
          {...this.props}
          filters={this.state}
          onChangeFilter={this.onChangeFilter}
        />
      );
    } else if (fetchingProperties && no_projects === undefined) {
      // first API call is in progress
      return (
        <div className="dashboard-content">
          <Loader isVisible />
        </div>
      );
    } else {
      return (
        <div className="dashboard-content">
          <p>
            Please contact your Account Manager to setup access to your
            properties
          </p>
        </div>
      );
    }
  }
}

export default UrlQueryLayer;
