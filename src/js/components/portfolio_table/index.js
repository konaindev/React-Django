import PropTypes from "prop-types";
import React from "react";

import PortfolioPropertyRow from "../portfolio_property_row";
import PortfolioPropertyGroupRow from "../portfolio_property_group_row";
import { InfoTooltip } from "../rmb_tooltip";

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

  /**
   * map kpi to i18n key
   *
   * kpi -> defined in remark/lib/time_series/common.py
   * tooltip -> defined in admin uploaded i18n csv
   */
  tooltipsByKpi = {
    // Leasing Performance
    leased_rate: "leased_rate",
    renewal_rate: "retention_rate",
    occupancy_rate: "occupied_rate",
    // Campaign Investment
    estimated_revenue_gain: "est_revenue_change",
    romi: "campaign_return_on_marketing_investment",
    exe_to_lowest_rent: "cost_per_exe_lowest_monthly_rent",
    // Acquisition Funnel - Volumes
    usvs: "volume_of_usv",
    inquiries: "volume_of_inq",
    tours: "volume_of_tou",
    lease_applications: "volume_of_app",
    leases_executed: "volume_of_exe",
    // Acquisition Funnel - Conversion Rates
    usv_inq: "usv_to_inq",
    inq_tou: "inq_to_tou",
    tou_app: "tou_to_app",
    app_exe: "app_to_exe",
    usv_exe: "usv_to_exe",
    // Acquisition Funnel - Cost Per Activity
    usv_cost: "cost_per_usv",
    inq_cost: "cost_per_inq",
    tou_cost: "cost_per_tou",
    app_cost: "cost_per_app",
    exe_cost: "cost_per_exe"
  };

  renderRows() {
    const kpiOrder = this.props.kpi_order.map(kpi => kpi.value);
    return this.props.properties.map((property, index) => {
      if (property && property !== null) {
        const Row = PortfolioTable.rowType[property.type];
        return <Row {...property} kpi_order={kpiOrder} key={index} />;
      }
    });
  }

  renderHeaderKPIs() {
    return this.props.kpi_order.map(kpi => (
      <div className="portfolio-table__kpi" key={kpi.value}>
        <span>
          {kpi.label}
          <InfoTooltip transKey={this.tooltipsByKpi[kpi.value]} />
        </span>
      </div>
    ));
  }

  render() {
    return (
      <div className="portfolio-table">
        <div className="portfolio-table__header">
          <div className="portfolio-table__title">Group</div>
          <div className="portfolio-table__kpis">{this.renderHeaderKPIs()}</div>
        </div>
        <div className="portfolio-table__body">{this.renderRows()}</div>
      </div>
    );
  }
}
