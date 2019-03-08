import React, { Component } from "react";
import cn from "classnames";
import PropTypes from "prop-types";

import PopulationChart from "../population_chart";
import { formatCurrencyShorthand, formatNumber } from "../../utils/formatters";
import "./market_size_by_income.scss";

export default class MarketSizeByIncome extends Component {
  static propTypes = {
    income: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    segment_population: PropTypes.number.isRequired,
    group_population: PropTypes.number.isRequired,
    home_owners: PropTypes.shape({
      total: PropTypes.number,
      family: PropTypes.number,
      nonfamily: PropTypes.number
    }),
    renters: PropTypes.shape({
      total: PropTypes.number,
      family: PropTypes.number,
      nonfamily: PropTypes.number
    }),
    market_size: PropTypes.number.isRequired,
    active_populations: PropTypes.array.isRequired
  };

  render() {
    const {
      income,
      segment_population,
      group_population,
      home_owners,
      renters,
      market_size,
      active_populations
    } = this.props;
    return (
      <div className="market-size-by-income">
        <div className="market-size-by-income__heading">
          EST.INCOME > {formatCurrencyShorthand(income)}/YR
        </div>
        <div className="market-size-by-income__est-pop">Est. Population</div>
        <PopulationChart
          segment_population={segment_population}
          group_population={group_population}
        />
        <div className="market-size-by-income__tables">
          <div className="market-size-by-income__table">
            <div className="market-size-by-income__table-head">
              <div className="text-left">Home Owners</div>
              <div
                className={cn("text-right", {
                  highlight: active_populations.includes("home_owners.total")
                })}
              >
                {formatNumber(home_owners.total)}
              </div>
            </div>
            <div className="market-size-by-income__table-row">
              <div className="text-left">Family</div>
              <div
                className={cn("text-right", {
                  highlight: active_populations.includes("home_owners.family")
                })}
              >
                {formatNumber(home_owners.family)}
              </div>
            </div>
            <div className="market-size-by-income__table-row">
              <div className="text-left">Non family</div>
              <div
                className={cn("text-right", {
                  highlight: active_populations.includes(
                    "home_owners.nonfamily"
                  )
                })}
              >
                {formatNumber(home_owners.nonfamily)}
              </div>
            </div>
          </div>
          <div className="market-size-by-income__table">
            <div className="market-size-by-income__table-head">
              <div className="text-left">Renters</div>
              <div
                className={cn("text-right", {
                  highlight: active_populations.includes("renters.total")
                })}
              >
                {formatNumber(renters.total)}
              </div>
            </div>
            <div className="market-size-by-income__table-row">
              <div className="text-left">Family</div>
              <div
                className={cn("text-right", {
                  highlight: active_populations.includes("renters.family")
                })}
              >
                {formatNumber(renters.family)}
              </div>
            </div>
            <div className="market-size-by-income__table-row">
              <div className="text-left">Non Family</div>
              <div
                className={cn("text-right", {
                  highlight: active_populations.includes("renters.nonfamily")
                })}
              >
                {formatNumber(renters.nonfamily)}
              </div>
            </div>
          </div>
        </div>

        <div className="market-size-by-income__footer">
          <div>Est. Market Size:</div>
          <div className="market-size-by-income__market-size-value">
            {formatNumber(market_size)}
          </div>
        </div>
      </div>
    );
  }
}
