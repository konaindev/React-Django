import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";
import { VictoryPie } from "victory";

import BoxRow from "../box_row";
import ReportSection from "../report_section";
import { formatCurrencyShorthand, formatPercent } from "../../utils/formatters";

import scssVars from "./investment_allocation.scss";

const InvestmentAllocationChart = ({ name, expenses, total }) => {
  const getLabel = d => {
    if (d.y === 0 || d.total === 0) {
      return "";
    }
    return formatPercent(d.y / d.total);
  };

  const getClasses = value =>
    cn("investment-allocation__row", {
      "investment-allocation__row--empty": !value
    });

  const pieStyle = {
    data: {
      fill: d => d.fill
    },
    labels: {
      fill: d => d.textColor,
      fontSize: scssVars.investmentAllocationLableSize,
      fontFamily: scssVars.fontSans
    }
  };

  const totalNum = Number(total);
  const reputationBuilding = Number(expenses.reputation_building);
  const demandCreation = Number(expenses.demand_creation);
  const leasingEnablement = Number(expenses.leasing_enablement);
  const marketIntelligence = Number(expenses.market_intelligence);

  const numberOfValues = [
    reputationBuilding,
    demandCreation,
    leasingEnablement,
    marketIntelligence
  ].filter(x => x).length;

  let labelRadius = 40;
  if (numberOfValues === 1) {
    labelRadius = -5;
  }

  if (numberOfValues === 0) {
    pieStyle.parent = {
      borderRadius: "50%",
      border: "1px dashed",
      borderColor: scssVars.investmentAllocationBorderColor
    };
  }

  const data = [
    {
      x: "",
      y: marketIntelligence,
      fill: scssVars.investmentAllocationPieColor4,
      textColor: scssVars.investmentAllocationLableColor1,
      total: totalNum
    },
    {
      x: "",
      y: leasingEnablement,
      fill: scssVars.investmentAllocationPieColor3,
      textColor: scssVars.investmentAllocationLableColor1,
      total: totalNum
    },
    {
      x: "",
      y: demandCreation,
      fill: scssVars.investmentAllocationPieColor2,
      textColor: scssVars.investmentAllocationLableColor1,
      total: totalNum
    },
    {
      x: "",
      y: reputationBuilding,
      fill: scssVars.investmentAllocationPieColor1,
      textColor: scssVars.investmentAllocationLableColor2,
      total: totalNum
    }
  ];
  return (
    <div className="investment-allocation">
      <ReportSection name={`${name} INVESTMENT ALLOCATIONS`}>
        <div className="investment-allocation__body">
          <div className="investment-allocation__chart">
            <VictoryPie
              width={parseInt(scssVars.investmentAllocationPieSize)}
              height={parseInt(scssVars.investmentAllocationPieSize)}
              data={data}
              labelRadius={() => labelRadius}
              labels={getLabel}
              style={pieStyle}
              padding={0}
            />
          </div>
          <div className="investment-allocation__expenses">
            <div className={getClasses(reputationBuilding)}>
              <div className="investment-allocation__title investment-allocation__title--reputation-building">
                Reputation Building
              </div>
              <div className="investment-allocation__value">
                {formatCurrencyShorthand(reputationBuilding)}
              </div>
            </div>
            <div className={getClasses(demandCreation)}>
              <div className="investment-allocation__title investment-allocation__title--demand-creation">
                Demand Creation
              </div>
              <div className="investment-allocation__value">
                {formatCurrencyShorthand(demandCreation)}
              </div>
            </div>
            <div className={getClasses(leasingEnablement)}>
              <div className="investment-allocation__title investment-allocation__title--leasing-enablement">
                Leasing Enablement
              </div>
              <div className="investment-allocation__value">
                {formatCurrencyShorthand(leasingEnablement)}
              </div>
            </div>
            <div className={getClasses(marketIntelligence)}>
              <div className="investment-allocation__title investment-allocation__title--market-intelligence">
                Market Intelligence
              </div>
              <div className="investment-allocation__value">
                {formatCurrencyShorthand(marketIntelligence)}
              </div>
            </div>
          </div>
        </div>
      </ReportSection>
    </div>
  );
};

InvestmentAllocationChart.propTypes = {
  name: PropTypes.string.isRequired,
  expenses: PropTypes.shape({
    demand_creation: PropTypes.string.isRequired,
    leasing_enablement: PropTypes.string.isRequired,
    market_intelligence: PropTypes.string.isRequired,
    reputation_building: PropTypes.string.isRequired
  }),
  total: PropTypes.string.isRequired
};

const InvestmentAllocation = ({ acquisition, retention }) => {
  return (
    <BoxRow>
      <InvestmentAllocationChart name="acquisition" {...acquisition} />
      <InvestmentAllocationChart name="retention" {...retention} />
    </BoxRow>
  );
};

InvestmentAllocation.propTypes = {
  retention: PropTypes.object.isRequired,
  acquisition: PropTypes.object.isRequired
};

export default InvestmentAllocation;
