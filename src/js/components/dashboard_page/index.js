import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cn from "classnames";
import _isArray from "lodash/isArray";
import _isEmpty from "lodash/isEmpty";
import _isEqual from "lodash/isEqual";

import AddPropertyModal from "../add_property_modal";
import { states } from "../add_property_form/states";
import Button from "../button";
import DashboardControls from "../dashboard_controls";
import Container from "../container";
import PageChrome from "../page_chrome";
import PropertyCardList from "../property_card_list";
import PropertyList from "../property_list";
import ToggleButton from "../toggle_button";
import InviteModal from "../invite_modal";
import { Close, ListView, TileView } from "../../icons";
import Loader from "../loader";
import UserMenu from "../user_menu";

import router from "../../router";
import { qsParse, qsStringify } from "../../utils/misc";
import TutorialView from "../tutorial_view";
import { networking, inviteModal, general } from "../../state/actions";

import "./dashboard_page.scss";

const navLinks = {
  links: [
    {
      id: "portfolio",
      name: "Portfolio",
      url: "/dashboard"
    },
    {
      id: "portfolio-analysis",
      name: "Portfolio Analysis",
      url: "/portfolio/table"
    }
  ],
  selected_link: "portfolio"
};

export class DashboardPage extends React.PureComponent {
  static propTypes = {
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
    onChangeFilter: () => {},
    navLinks: navLinks
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
      isShowAddPropertyForm: false
    };

    this._router = router("/dashboard")(queryString => {
      // @TODO:
      // uncomment in case of Django -> DashboardView renders empty props initially
      //
      // props.dispatch({
      //   type: "API_DASHBOARD",
      //   queryString
      // });
    });
  }

  selectAll = () => {
    const selectedProperties = this.props.properties;
    this.props.dispatch(general.update({ selectedProperties }));
  };

  cancelSelect = () => {
    this.props.dispatch(general.update({ selectedProperties: [] }));
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

  onChangeFilter = filters => this.props.onChangeFilter(filters);

  toggleView = viewType => this.setState({ viewType });

  onSelectHandler = selectedProperties => {
    this.props.dispatch(general.update({ selectedProperties }));
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

  getHeaderItems() {
    if (this.props.user) {
      return <UserMenu {...this.props.user} />;
    }
    return null;
  }

  render() {
    const className = cn("dashboard-content", {
      "dashboard-content--selection-mode": this.props.selectedProperties.length
    });
    const { user } = this.props;
    const PropertiesListComponent = this.propertiesListComponent;
    const navLinks = this.props.navLinks;
    const { isFetching } = this.props;
    return (
      <PageChrome navLinks={navLinks} headerItems={this.getHeaderItems()}>
        <TutorialView />
        <InviteModal />
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
                  disabled={isFetching}
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
                  isDisabled={isFetching}
                  dispatch={this.props.dispatch}
                />
              </div>
              <div className="dashboard-content__selection">
                <DashboardSelection
                  selectedProperties={this.props.selectedProperties}
                  inviteHandler={this.inviteHandler}
                  selectAll={this.selectAll}
                  cancelSelect={this.cancelSelect}
                />
              </div>
            </div>
            <div className="dashboard-content__properties">
              <Loader isShow={isFetching} />
              <PropertiesListComponent
                properties={this.props.properties}
                selectedProperties={this.props.selectedProperties}
                onSelect={this.onSelectHandler}
              />
            </div>
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
  inviteHandler,
  selectAll,
  cancelSelect
}) => {
  return (
    <div className="dashboard-selection">
      <div className="dashboard-selection__title">
        {selectedProperties.length}
        {selectedProperties.length === 1 ? " Property" : " Properties"} Selected
      </div>
      <div className="dashboard-selection__controls">
        <Button
          className="dashboard-selection__button"
          color="secondary"
          onClick={inviteHandler}
        >
          invite
        </Button>
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
  selectAll: PropTypes.func.isRequired,
  cancelSelect: PropTypes.func.isRequired
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

    let queryStringForView = qsStringify(urlParams);
    let queryStringForAjax = qsStringify({ ...urlParams, ajax: "true" });
    window.history.replaceState({}, "", `/dashboard${queryStringForView}`);
    this.props.dispatch(networking.fetchDashboard(queryStringForAjax));
  };

  render() {
    if (this.props.no_projects || !this.props.properties) {
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
        filters={this.state}
        onChangeFilter={this.onChangeFilter}
      />
    );
  }
}

const mapState = state => {
  return {
    ...state.general,
    ...state.network
  };
};
export default connect(mapState)(UrlQueryLayer);
