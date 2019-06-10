import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import Button from "../button";
import Container from "../container";
import PageChrome from "../page_chrome";
import PropertyCardList from "../property_card_list";
import PropertyList from "../property_list";
import SearchField from "../search_field";
import { Close } from "../../icons";

import "./dashboard_page.scss";

export default class DashboardPage extends React.PureComponent {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    selectedProperties: PropTypes.arrayOf(PropTypes.string),
    viewType: PropTypes.string
  };

  static defaultProps = {
    selectedProperties: [],
    viewType: "card"
  };

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

  rowView = () => {
    this.setState({ viewType: "row" });
  };

  cardView = () => {
    this.setState({ viewType: "card" });
  };

  get propertiesListComponent() {
    if (this.state.viewType === "card") {
      return PropertyCardList;
    } else {
      return PropertyList;
    }
  }

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
              <div>
                <div className="dashboard-content__select-view">
                  <Button onClick={this.rowView}>row</Button>
                  <Button onClick={this.cardView}>card</Button>
                </div>
                <Button color="primary">Add Property</Button>
              </div>
            </div>
            <div className="dashboard-content__controls">
              <div className="dashboard-content__filters">
                <DashboardControls properties={this.props.properties} />
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

const DashboardControls = ({ properties }) => {
  return (
    <SearchField>
      <div className="dashboard-controls">
        <span className="dashboard-controls__title">
          {properties.length} Properties
        </span>
        <select className="dashboard-controls__field">
          <option />
          <option>1</option>
        </select>
        <select className="dashboard-controls__field">
          <option />
          <option>1</option>
        </select>
        <select className="dashboard-controls__field">
          <option />
          <option>1</option>
        </select>
        <select className="dashboard-controls__field">
          <option />
          <option>1</option>
        </select>
        <div className="dashboard-controls__sort">
          <div className="dashboard-controls__sort-title">SORT:</div>
          <select>
            <option>Recently Viewed</option>
            <option>By Property Mgr.</option>
            <option>By Asset Owner</option>
            <option>By region</option>
            <option>By City</option>
            <option>By Fund</option>
            <option>By performance</option>
          </select>
        </div>
      </div>
    </SearchField>
  );
};

DashboardControls.propTypes = {
  properties: PropTypes.array.isRequired
};
