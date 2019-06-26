import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import PortfolioPropertyRow from "../portfolio_property_row";

import groupScss from "./portfolio_property_group_row.scss";
import rowScss from "../portfolio_property_row/portfolio_property_row.scss";

export default class PortfolioPropertyGroupRow extends React.PureComponent {
  static propTypes = {
    image_url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    properties: PropTypes.array.isRequired,
    kpi_order: PropTypes.array.isRequired,
    kpis: PropTypes.object.isRequired,
    targets: PropTypes.object.isRequired
  };

  state = {
    isOpen: false
  };

  get containerStyle() {
    const containerStyle = {};
    if (this.state.isOpen) {
      containerStyle.height =
        parseInt(rowScss.portfolioPropertyRowHeight) *
          this.props.properties.length +
        parseInt(groupScss.portfolioPropertyGroupRowHeight);
    }
    return containerStyle;
  }

  renderKPIs() {
    return this.props.kpi_order.map((kpi, index) => {
      let target = "";
      if (this.props.targets[kpi]) {
        target = `Target: ${this.props.targets[kpi]}`;
      }
      return (
        <div className="portfolio-property-group-row__kpi" key={index}>
          <div className="portfolio-property-group-row__value">
            {this.props.kpis[kpi]}
          </div>
          <div className="portfolio-property-group-row__target">{target}</div>
        </div>
      );
    });
  }

  renderPortfolioProperties() {
    if (!this.state.isOpen) {
      return null;
    }
    return this.props.properties.map((property, index) => (
      <PortfolioPropertyRow
        {...property}
        type="subproperty"
        kpi_order={this.props.kpi_order}
        key={index}
      />
    ));
  }

  toggleHandler = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { image_url, name, properties } = this.props;
    const imageStyle = {
      backgroundImage: `url("${image_url}")`
    };
    const classes = cn("portfolio-property-group-row__group", {
      "portfolio-property-group-row__group--open": this.state.isOpen
    });
    return (
      <div className="portfolio-property-group-row" style={this.containerStyle}>
        <div className={classes} onClick={this.toggleHandler}>
          <div
            className="portfolio-property-group-row__image"
            style={imageStyle}
          />
          <div className="portfolio-property-group-row__title">
            <div className="portfolio-property-group-row__name">{name}</div>
            <div className="portfolio-property-group-row__property-count">
              {properties.length} Properties
            </div>
          </div>
          <div className="portfolio-property-group-row__kpis">
            {this.renderKPIs()}
          </div>
        </div>
        {this.renderPortfolioProperties()}
      </div>
    );
  }
}
