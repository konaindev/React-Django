import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import PropertyStatus from "../property_status";

import "./portfolio_property_row.scss";

import { formatKPI } from "../../utils/kpi_formatters";

export default class PortfolioPropertyRow extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(["individual", "subproperty"]).isRequired,
    url: PropTypes.string,
    image_url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    health: PropTypes.oneOf([-1, 0, 1, 2]).isRequired,
    kpi_order: PropTypes.array.isRequired,
    kpis: PropTypes.object.isRequired,
    targets: PropTypes.object
  };

  renderKPIs() {
    return this.props.kpi_order.map((kpi, index) => {
      let target = "";
      if ("targets" in this.props && kpi in this.props.targets) {
        target = `Target: ${formatKPI(kpi, this.props.targets[kpi])}`;
      }
      return (
        <div className="portfolio-property-row__kpi" key={index}>
          <div className="portfolio-property-row__value">
            {formatKPI(kpi, this.props.kpis[kpi])}
          </div>
          <div className="portfolio-property-row__target">{target}</div>
        </div>
      );
    });
  }

  render() {
    const { image_url, name, address, health, type, url } = this.props;
    const imageStyle = {
      backgroundImage: `url("${image_url}")`
    };
    const classes = cn("portfolio-property-row", {
      "portfolio-property-row--subproperty": type === "subproperty"
    });
    return (
      <div className={classes}>
        <div className="portfolio-property-row__image" style={imageStyle} />
        <div className="portfolio-property-row__title">
          <div className="portfolio-property-row__name">{name}</div>
          <div className="portfolio-property-row__address">{address}</div>
        </div>
        <div className="portfolio-property-row__info">
          <PropertyStatus
            className="portfolio-property-row__health"
            performance_rating={health}
          />
          <Link
            style={{ color: "inherit", textDecoration: "inherit" }}
            className="portfolio-property-row__link"
            to={url || "#"}
          >
            View Property
          </Link>
        </div>
        <div className="portfolio-property-row__kpis">{this.renderKPIs()}</div>
      </div>
    );
  }
}
