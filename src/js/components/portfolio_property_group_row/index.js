import cn from "classnames";
import _isNil from "lodash/isNil";
import PropTypes from "prop-types";
import React from "react";

import PortfolioPropertyRow from "../portfolio_property_row";

import groupScss from "./portfolio_property_group_row.scss";
import rowScss from "../portfolio_property_row/portfolio_property_row.scss";

import { formatKPI } from "../../utils/kpi_formatters";

export default class PortfolioPropertyGroupRow extends React.PureComponent {
  static propTypes = {
    image_url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    properties: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.number
    ]),
    kpi_order: PropTypes.array.isRequired,
    kpis: PropTypes.object,
    targets: PropTypes.object
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

  get propertiesCount() {
    if (!this.props.properties) {
      return null;
    }
    const propertiesCount =
      this.props.properties.length || this.props.properties;
    return (
      <div className="portfolio-property-group-row__property-count">
        {propertiesCount} Properties
      </div>
    );
  }

  get isOpening() {
    return this.props.properties && this.props.properties.length;
  }

  renderKPIs() {
    return this.props.kpi_order.map((kpi, index) => {
      let target = "";
      if ("targets" in this.props && kpi in this.props.targets) {
        target = `Target: ${formatKPI(kpi, this.props.targets[kpi])}`;
      }
      let value = "";
      if (!_isNil(this.props.kpis?.[kpi])) {
        value = formatKPI(kpi, this.props.kpis[kpi]);
      }
      return (
        <div className="portfolio-property-group-row__kpi" key={index}>
          <div className="portfolio-property-group-row__value">{value}</div>
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
    if (this.isOpening) {
      this.setState({ isOpen: !this.state.isOpen });
    }
  };

  render() {
    const { image_url, name, properties } = this.props;
    const imageStyle = {
      backgroundImage: `url("${image_url}")`
    };
    const classes = cn("portfolio-property-group-row__group", {
      "portfolio-property-group-row__group--open": this.state.isOpen,
      "portfolio-property-group-row__group--opening": this.isOpening
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
            {this.propertiesCount}
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
