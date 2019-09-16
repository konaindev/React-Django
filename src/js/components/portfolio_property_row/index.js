import cn from "classnames";
import _isNil from "lodash/isNil";
import PropTypes from "prop-types";
import React from "react";

import "./portfolio_property_row.scss";

import Alarm from "../../icons/alarm";
import { formatKPI } from "../../utils/kpi_formatters";
import PropertyStatus from "../property_status";
import Tooltip from "../rmb_tooltip";

export default class PortfolioPropertyRow extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(["individual", "subproperty"]).isRequired,
    url: PropTypes.string,
    image_url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    health: PropTypes.oneOf([-1, 0, 1, 2]).isRequired,
    kpi_order: PropTypes.array.isRequired,
    kpis: PropTypes.object,
    targets: PropTypes.object
  };

  get isNoData() {
    return _isNil(this.props.kpis);
  }

  renderKPIs() {
    return this.props.kpi_order.map((kpi, index) => {
      let target = "";
      if ("targets" in this.props && kpi in this.props.targets) {
        target = `Target: ${formatKPI(kpi, this.props.targets[kpi])}`;
      }
      let value = "";
      if (this.props.kpis?.[kpi]) {
        value = formatKPI(kpi, this.props.kpis[kpi]);
      }
      return (
        <div className="portfolio-property-row__kpi" key={index}>
          <div className="portfolio-property-row__value">{value}</div>
          <div className="portfolio-property-row__target">{target}</div>
        </div>
      );
    });
  }

  renderNoDataTooltip() {
    const message = (
      <div className="portfolio-property-row__alarm-text">
        No data found for this property during this reporting period.
      </div>
    );
    if (this.isNoData) {
      return (
        <Tooltip placement="top" overlay={message}>
          <div className="portfolio-property-row__alarm">
            <Alarm className="portfolio-property-row__alarm-icon" />
          </div>
        </Tooltip>
      );
    }
  }

  render() {
    const { image_url, name, address, health, type, url } = this.props;
    const imageStyle = {
      backgroundImage: `url("${image_url}")`
    };
    const classes = cn("portfolio-property-row", {
      "portfolio-property-row--subproperty": type === "subproperty",
      "portfolio-property-row--with-alarm": this.isNoData
    });
    return (
      <div className={classes}>
        {this.renderNoDataTooltip()}
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
          <a className="portfolio-property-row__link" href={url}>
            View Property
          </a>
        </div>
        <div className="portfolio-property-row__kpis">{this.renderKPIs()}</div>
      </div>
    );
  }
}
