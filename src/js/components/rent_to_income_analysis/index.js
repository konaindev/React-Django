import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Panel from "../panel";
import { InfoTooltip } from "../rmb_tooltip";
import {
  formatCurrency,
  formatCurrencyShorthand,
  formatPercent
} from "../../utils/formatters";
import "./rent_to_income_analysis.scss";

const THREASHOLD_COLUMNS = 10;

const getCategoryIndexOfRate = (categories, rate) =>
  rate
    ? categories.findIndex(
        category => category.low <= rate && category.high > rate
      )
    : -1;

export const RentToIncomeAnalysis = ({
  categories,
  incomes,
  rental_rates,
  data
}) => {
  const flipMode = incomes.length >= THREASHOLD_COLUMNS;
  const minRate = categories[0].low;
  const maxRate = categories[categories.length - 1].high;
  return (
    <Panel
      className={cx("rent-to-income-analysis", {
        "rent-to-income-analysis--flip": flipMode
      })}
    >
      <div className="rent-to-income-analysis__legends-wrapper">
        <div className="rent-to-income-analysis__ratio">
          Rent to Income Ratio:
        </div>
        <div className="rent-to-income-analysis__categories">
          {categories.map((category, index) => (
            <div key={index} className="rent-to-income-analysis__category">
              <span
                className={cx(
                  "rent-to-income-analysis__category-color",
                  `rent-to-income-analysis__category-color--${index}`
                )}
              />
              <span className="rent-to-income-analysis__category-name">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="rent-to-income-analysis__chart-wrapper">
        <div className="rent-to-income-analysis-chart">
          <div className="chart__caption chart__caption--vertical">
            Monthly Rental (USD)
            <InfoTooltip transKey="monthly_rental_usd" />
          </div>
          <div className="chart__caption chart__caption--horizontal">
            Annual Income (USD)
            <InfoTooltip transKey="annual_income_usd" />
          </div>
          <div className="rent-to-income-analysis-chart__body">
            <div className="rent-to-income-analysis-chart__group rent-to-income-analysis-chart__group--yaxis">
              <div className="rent-to-income-analysis-chart__cell"> </div>
              {rental_rates.map((rentalRate, rateIndex) => (
                <div
                  key={rateIndex}
                  className="rent-to-income-analysis-chart__cell rent-to-income-analysis-chart__cell--yaxis"
                >
                  {formatCurrency(rentalRate)}
                </div>
              ))}
            </div>
            {data.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="rent-to-income-analysis-chart__group"
              >
                <div className="rent-to-income-analysis-chart__cell rent-to-income-analysis-chart__cell--xaxis">
                  {formatCurrencyShorthand(incomes[groupIndex])}
                </div>
                {group.map((rate, rateIndex) => (
                  <div
                    key={`${groupIndex}-${rateIndex}`}
                    className={cx(
                      "rent-to-income-analysis-chart__cell",
                      `rent-to-income-analysis__category-color--${getCategoryIndexOfRate(
                        categories,
                        rate
                      )}`
                    )}
                  >
                    {rate &&
                      rate <= maxRate &&
                      rate >= minRate &&
                      formatPercent(rate)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
};

RentToIncomeAnalysis.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      low: PropTypes.number,
      high: PropTypes.number
    })
  ),
  incomes: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  rental_rates: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.array).isRequired
};

export default RentToIncomeAnalysis;
