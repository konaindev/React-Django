import _isEqual from "lodash/isEqual";
import _pickBy from "lodash/pickBy";
import PropTypes from "prop-types";
import React from "react";

import { Tick } from "../../icons";
import { accountSettings } from "../../state/actions";

import Button from "../button";
import ButtonToggle, { STATE_ENUM as TOGGLE_STATE } from "../button_toggle";
import EmailReportingTable from "../email_reporting_table";
import { SearchWithSort } from "../search_input/search_with_sort";
import TabNavigator, { Tab } from "../tab_navigator";

const TYPING_TIMEOUT = 300;

export default class EmailReports extends React.PureComponent {
  static propTypes = {
    initialTab: PropTypes.oneOf(["portfolio", "group", "property"]),
    tabsOrder: PropTypes.array,
    properties: PropTypes.arrayOf(PropTypes.object),
    portfolioProperties: PropTypes.arrayOf(PropTypes.object),
    groupsProperties: PropTypes.arrayOf(PropTypes.object),
    initialSort: PropTypes.oneOf(["desc", "asc"]),
    onGroupsSort: PropTypes.func,
    onPropertiesSort: PropTypes.func,
    onGroupsSearch: PropTypes.func,
    onPropertiesSearch: PropTypes.func
  };
  static defaultProps = {
    initialTab: "property",
    tabsOrder: ["property"],
    portfolioProperties: [],
    groupsProperties: [],
    properties: [],
    initialSort: "asc",
    onGroupsSort() {},
    onPropertiesSort() {},
    onGroupsSearch() {},
    onPropertiesSearch() {}
  };
  static tabIndexMap = { property: 0 };

  constructor(props) {
    super(props);
    const propertiesToggled = this._getToggledProperties(props.properties);
    const groupsToggled = this._getToggledProperties(props.groupsProperties);
    const portfoliosToggled = this._getToggledProperties(
      props.portfolioProperties
    );
    this.state = {
      tabIndex: props.tabsOrder.indexOf(props.initialTab),
      propertiesSort: props.initialSort,
      propertiesSearch: null,
      portfoliosToggled,
      groupsToggled,
      propertiesToggled
    };
  }

  componentDidMount() {
    this.props.dispatch(
      accountSettings.getProperties({ d: this.state.propertiesSort })
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const state = this.state;
    if (
      state.propertiesSort !== prevState.propertiesSort ||
      state.propertiesSearch !== prevState.propertiesSearch
    ) {
      this.props.dispatch(
        accountSettings.getProperties({
          d: state.propertiesSort,
          s: state.propertiesSearch
        })
      );
    }
    const newState = {};
    if (!_isEqual(this.props.properties, prevProps.properties)) {
      newState.propertiesToggled = this._getToggledProperties(
        this.props.properties
      );
    }
    if (!_isEqual(this.props.groupsProperties, prevProps.groupsProperties)) {
      newState.groupsToggled = this._getToggledProperties(
        this.props.groupsProperties
      );
    }
    if (
      !_isEqual(this.props.portfolioProperties, prevProps.portfolioProperties)
    ) {
      newState.portfoliosToggled = this._getToggledProperties(
        this.props.portfolioProperties
      );
    }
    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  }

  get selectedGroupsState() {
    return this._getPropertiesState(
      this.props.groupsProperties,
      this.state.groupsToggled
    );
  }

  get selectedPropertiesState() {
    return this._getPropertiesState(
      this.props.properties,
      this.state.propertiesToggled
    );
  }

  get successMessage() {
    if (!this.state.message) {
      return;
    }
    return (
      <div className="account-settings__success">
        <Tick className="account-settings__checked" />
        {this.state.message}
      </div>
    );
  }

  get portfolioTab() {
    const { portfolioProperties } = this.props;
    return (
      <Tab label="Portfolio" key="portfolio">
        <EmailReportingTable
          className="account-settings__reporting-table"
          properties={portfolioProperties}
          propertiesCount={portfolioProperties.length}
          propertiesToggled={this.state.portfoliosToggled}
          onToggleRow={this.onPortfolioRowToggle}
        />
      </Tab>
    );
  }

  get groupTab() {
    const { groupsProperties } = this.props;
    return (
      <Tab label="Groups" key="group">
        <div>
          <div className="account-settings__search-controls">
            <SearchWithSort
              className="account-settings__search"
              placeholder="Search Groups"
              theme="gray"
              initialSort="asc"
              onSort={this.props.onGroupsSort}
              onSearch={this.props.onGroupsSearch}
            />
            <ButtonToggle
              className="account-settings__toggle"
              checked={this.selectedGroupsState}
              onChange={this.onSelectGroups}
            />
          </div>
          <EmailReportingTable
            className="account-settings__reporting-table"
            properties={groupsProperties}
            propertiesCount={groupsProperties.length}
            propertiesToggled={this.state.groupsToggled}
            onToggleRow={this.onGroupRowToggle}
          />
        </div>
      </Tab>
    );
  }

  get propertyTab() {
    const { properties } = this.props;
    return (
      <Tab label="Properties" key="property">
        <div>
          <div className="account-settings__search-controls">
            <SearchWithSort
              className="account-settings__search"
              placeholder="Search Properties"
              theme="gray"
              initialSort={this.props.initialSort}
              onSort={this.onPropertiesSort}
              onSearch={this.onPropertiesSearch}
            />
            <ButtonToggle
              className="account-settings__toggle"
              checked={this.selectedPropertiesState}
              onChange={this.onSelectProperties}
            />
          </div>
          <EmailReportingTable
            className="account-settings__reporting-table"
            properties={properties}
            propertiesCount={properties.length}
            propertiesToggled={this.state.propertiesToggled}
            onToggleRow={this.onPropertyRowToggle}
          />
        </div>
      </Tab>
    );
  }

  _getToggledProperties = properties => {
    const propertiesToggled = {};
    for (let p of properties) {
      propertiesToggled[p.id] = !!p.is_report;
    }
    return propertiesToggled;
  };

  _getPropertiesState = (properties, toggledProperties) => {
    const keys = properties.map(i => i.id.toString());
    const selectedProperties = Object.entries(toggledProperties).filter(
      ([key, checked]) => {
        return checked && keys.includes(key);
      }
    );
    if (selectedProperties.length === 0) {
      return TOGGLE_STATE.UNCHECKED;
    }
    if (selectedProperties.length === properties.length) {
      return TOGGLE_STATE.CHECKED;
    }
    return TOGGLE_STATE.MEDIUM;
  };

  onSelectGroups = checked => {
    const groupsToggled = { ...this.state.groupsToggled };
    for (let p of this.props.groupsProperties) {
      groupsToggled[p.id] = checked;
    }
    this.setState({ groupsToggled });
  };

  onSelectProperties = checked => {
    const propertiesToggled = { ...this.state.propertiesToggled };
    for (let p of this.props.properties) {
      propertiesToggled[p.id] = checked;
    }
    this.setState({ propertiesToggled });
  };

  onPortfolioRowToggle = (id, checked) => {
    const portfoliosToggled = {
      ...this.state.portfoliosToggled,
      [id]: checked
    };
    this.setState({ portfoliosToggled });
  };

  onGroupRowToggle = (id, checked) => {
    const groupsToggled = { ...this.state.groupsToggled, [id]: checked };
    this.setState({ groupsToggled });
  };

  onPropertyRowToggle = (id, checked) => {
    const propertiesToggled = {
      ...this.state.propertiesToggled,
      [id]: checked
    };
    this.setState({ propertiesToggled });
  };

  onPropertiesSort = propertiesSort => {
    this.props.onPropertiesSort(propertiesSort);
    this.setState({ propertiesSort });
  };

  onPropertiesSearch = propertiesSearch => {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.props.onPropertiesSearch(propertiesSearch);
      this.setState({ propertiesSearch });
    }, TYPING_TIMEOUT);
  };

  setSuccessMessage = () => {
    const message = "Your changes have been saved.";
    this.setState({ message });
  };

  onSubmit = () => {
    const data = {
      properties: Object.keys(_pickBy(this.state.propertiesToggled))
    };
    this.props.dispatch({
      type: "API_ACCOUNT_REPORTS",
      callback: this.setSuccessMessage,
      data
    });
  };

  render() {
    const tabs = this.props.tabsOrder.map(n => this[`${n}Tab`]);
    return (
      <div className="account-settings__tab">
        <div className="account-settings__tab-content">
          <div className="account-settings__tab-section">
            <div className="account-settings__tab-header">
              <div className="account-settings__tab-title">
                Email Preferences
              </div>
              <div className="account-settings__tab-subtitle">
                Manage email reports and alerts across your portfolio.
              </div>
            </div>
          </div>
          <div className="account-settings__tab-section account-settings__tab-section--zero-pad">
            <TabNavigator
              className="account-settings__tab-navigator"
              onChange={tabIndex => this.setState({ tabIndex })}
              selectedIndex={this.state.tabIndex}
            >
              {tabs}
            </TabNavigator>
          </div>
        </div>
        <div className="account-settings__controls">
          <Button
            className="account-settings__button"
            color="primary"
            type="submit"
            onClick={this.onSubmit}
          >
            Save
          </Button>
          {this.successMessage}
        </div>
      </div>
    );
  }
}
