import _isEqual from "lodash/isEqual";
import PropTypes from "prop-types";
import React from "react";

import Container from "../container";
import DateRangeSelector from "../date_range_selector";
import PageChrome from "../page_chrome";
import PortfolioTable from "../portfolio_table";
import KPICard from "../kpi_card";
import Select from "../select";
import ShareToggle from "../share_toggle";
import { formatPercent } from "../../utils/formatters";
import UserMenu from "../user_menu";

import { formatKPI } from "../../utils/kpi_formatters";

import "./portfolio_analysis_view.scss";

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
  selected_link: "portfolio-analysis"
};

export class PortfolioAnalysisView extends React.PureComponent {
  static propTypes = {
    navLinks: PropTypes.shape({
      links: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired
        })
      ),
      selected_link: PropTypes.string.isRequired
    }),
    kpi_bundles: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    selected_kpi_bundle: PropTypes.string.isRequired,
    date_selection: PropTypes.shape({
      preset: PropTypes.string.isRequired,
      end_date: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired
    }).isRequired,
    highlight_kpis: PropTypes.arrayOf(
      PropTypes.shape({
        health: PropTypes.oneOf([-1, 0, 1, 2]).isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        target: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired
      })
    ).isRequired,
    table_data: PropTypes.arrayOf(PropTypes.object).isRequired,
    user: PropTypes.object
  };

  static defaultProps = {
    navLinks: navLinks
  };

  get kpiOptions() {
    return this.props.kpi_bundles.map(kpi => ({
      label: kpi.name,
      value: kpi.value
    }));
  }

  get kpiValue() {
    const kpi = this.props.kpi_bundles.find(
      kpi => kpi.value === this.props.selected_kpi_bundle
    );
    return {
      label: kpi.name,
      value: kpi.value
    };
  }

  renderKPICards = () => {
    return this.props.highlight_kpis.map(
      ({ name, health, label, value, target }) => (
        <KPICard
          className="portfolio-analysis__kpi-card"
          health={health}
          value={formatKPI(name, value)}
          name={label}
          target={formatKPI(name, target)}
          key={name}
        />
      )
    );
  };

  renderHeaderItems() {
    if (this.props.user) {
      return <UserMenu {...this.props.user} />;
    }
    return null;
  }

  onChangeKpi = option => {
    this.props.onChange({
      selected_kpi_bundle: option.value,
      date_selection: this.props.date_selection
    });
  };

  onChangeDateRange = (preset, startDate, endDate) => {
    this.props.onChange({
      selected_kpi_bundle: this.props.selected_kpi_bundle,
      date_selection: {
        preset,
        end_date: endDate,
        start_date: startDate
      }
    });
  };

  render() {
    const {
      navLinks,
      // share_info,
      date_selection,
      table_data,
      kpi_order
    } = this.props;
    return (
      <PageChrome navLinks={navLinks} headerItems={this.renderHeaderItems()}>
        <Container className="portfolio-analysis">
          <div className="portfolio-analysis__header">
            <div className="portfolio-analysis__title">Portfolio Analysis</div>
            {/* <ShareToggle
              {...share_info}
              current_report_name="portfolio_analysis"
            /> */}
          </div>
          <div className="portfolio-analysis__controls">
            <Select
              className="portfolio-analysis__select-kpi"
              theme="default"
              options={this.kpiOptions}
              value={this.kpiValue}
              onChange={this.onChangeKpi}
            />
            <DateRangeSelector
              start_date={date_selection.start_date}
              end_date={date_selection.end_date}
              preset={date_selection.preset}
              onChange={this.onChangeDateRange}
            />
          </div>
          <div className="portfolio-analysis__title-bar">
            <div>All Property Averages</div>
            <div className="portfolio-analysis__property-count">
              {table_data.length} properties
            </div>
          </div>
          <div className="portfolio-analysis__kpi-cards">
            {this.renderKPICards()}
          </div>
          <div className="portfolio-analysis__table">
            <PortfolioTable properties={table_data} kpi_order={kpi_order} />
          </div>
        </Container>
      </PageChrome>
    );
  }
}

export default class UrlQueryLayer extends React.PureComponent {
  onChangeHandler = params => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("b", params.selected_kpi_bundle);
    urlParams.set("p", params.date_selection.preset);
    urlParams.set("s", params.date_selection.start_date);
    urlParams.set("e", params.date_selection.end_date);
    window.location.search = urlParams.toString();
  };

  render() {
    return (
      <PortfolioAnalysisView {...this.props} onChange={this.onChangeHandler} />
    );
  }
}
