import PropTypes from "prop-types";
import React from "react";

import PortfolioPropertyRow from "../portfolio_property_row";
import PortfolioPropertyGroupRow from "../portfolio_property_group_row";

import "./portfolio_table.scss";

export default class PortfolioTable extends React.PureComponent {
  static propTypes = {
    properties: PropTypes.array.isRequired,
    kpi_order: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })
    ).isRequired
  };

  static rowType = {
    group: PortfolioPropertyGroupRow,
    individual: PortfolioPropertyRow
  };

  renderRow() {
    const kpiOrder = this.props.kpi_order.map(kpi => kpi.value);
    this.props.properties.map((property, index) => {
      if (property && property !== null) {
        const Row = PortfolioTable.rowType[property.type];
        return <Row {...property} kpi_order={kpiOrder} key={index} />;
      }
    });
  }

  renderHeaderKPIs() {
    return this.props.kpi_order.map(kpi => {
      return (
        <div className="portfolio-table__kpi" key={kpi.value}>
          {kpi.label}
        </div>
      );
    });
  }

  render() {
    return (
      <div className="portfolio-table">
        <div className="portfolio-table__header">
          <div className="portfolio-table__title">Group</div>
          <div className="portfolio-table__kpis">{this.renderHeaderKPIs()}</div>
        </div>
        <div className="portfolio-table__body">{this.renderRow()}</div>
      </div>
    );
  }
}
