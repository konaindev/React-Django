import React from "react";
import PropTypes from "prop-types";
import { VictoryPie } from "victory";
import _isNil from "lodash/isNil";
import cx from "classnames";

import BoxRow from "../box_row";
import ReportSection from "../report_section";
import { InfoTooltip } from "../rmb_tooltip";
import { SmallNumberBox, SmallCurrencyShorthandBox } from "../small_box_layout";
import {
  formatCurrencyShorthand,
  formatPercent,
  formatCurrencyShorthandWithDigit
} from "../../utils/formatters";
import scssVars from "./investment_allocation.scss";

const InvestmentAllocationChart = ({ name, expenses, total }) => {
  const ExpenseRow = ({ title, value, infoTooltip }) => (
    <div className={cx("expense-row", { "expense-row--empty": !value })}>
      <div className="expense-row__title">{title}</div>
      <div className="expense-row__value">{formatCurrencyShorthand(value)}</div>
      <InfoTooltip transKey={infoTooltip} />
    </div>
  );

  const getPieSliceLabel = d => {
    if (d.y === 0 || d.total === 0) {
      return "";
    }
    return formatPercent(d.y / d.total);
  };

  const pieStyle = {
    data: {
      fill: d => d.fill
    },
    labels: {
      fill: d => d.textColor,
      fontSize: scssVars.investmentAllocationLabelSize,
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
      textColor: scssVars.investmentAllocationLabelColor1,
      total: totalNum
    },
    {
      x: "",
      y: leasingEnablement,
      fill: scssVars.investmentAllocationPieColor3,
      textColor: scssVars.investmentAllocationLabelColor1,
      total: totalNum
    },
    {
      x: "",
      y: demandCreation,
      fill: scssVars.investmentAllocationPieColor2,
      textColor: scssVars.investmentAllocationLabelColor1,
      total: totalNum
    },
    {
      x: "",
      y: reputationBuilding,
      fill: scssVars.investmentAllocationPieColor1,
      textColor: scssVars.investmentAllocationLabelColor2,
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
              labels={getPieSliceLabel}
              style={pieStyle}
              padding={0}
            />
          </div>
          <div className="investment-allocation__expenses">
            <ExpenseRow
              title="Reputation Building"
              value={reputationBuilding}
              infoTooltip={`${name}_reputation_building`}
            />
            <ExpenseRow
              title="Demand Creation"
              value={demandCreation}
              infoTooltip={`${name}_demand_creation`}
            />
            <ExpenseRow
              title="Leasing Enablement"
              value={leasingEnablement}
              infoTooltip={`${name}_leasing_enablement`}
            />
            <ExpenseRow
              title="Market Intelligence"
              value={marketIntelligence}
              infoTooltip={`${name}_marketing_intelligence`}
            />
          </div>
        </div>
      </ReportSection>
    </div>
  );
};

InvestmentAllocationChart.propTypes = {
  name: PropTypes.string.isRequired,
  expenses: PropTypes.shape({
    demand_creation: PropTypes.number.isRequired,
    leasing_enablement: PropTypes.number.isRequired,
    market_intelligence: PropTypes.number.isRequired,
    reputation_building: PropTypes.number.isRequired
  }),
  total: PropTypes.number.isRequired
};

const formatFourWeekAverages = value => {
  if (_isNil(value)) {
    return;
  }
  const curValue = formatCurrencyShorthandWithDigit(value);
  return `4-Week Average: ${curValue}`;
};
const romi_tooltip = obj => {
  const numerator = formatCurrencyShorthand(obj.estimated_revenue_gain, true);
  const denominator = formatCurrencyShorthand(obj.total, true);
  return `${numerator} / ${denominator}`;
};
/**
 * @name CampaignInvestmentReport.AcquisitionDetails
 * @description Component to render campaign acq_investment detail numbers
 */
const AcquisitionDetails = ({ report: r }) => {
  return (
    <ReportSection name="Acquisition">
      <SmallNumberBox
        name="Leased Unit Change"
        value={r.property.leasing.change}
        target={r.targets?.property?.leasing?.change}
        symbolType="sign"
      />
      <SmallCurrencyShorthandBox
        name="Acquisition Investment"
        value={r.investment.acquisition.total}
        detail2={formatFourWeekAverages(
          r.four_week_funnel_averages?.acq_investment
        )}
        target={r.targets?.investment?.acquisition?.total}
        delta={r.deltas?.investment?.acquisition?.total}
      />
      <SmallCurrencyShorthandBox
        name="Est. Acquired Leasing Revenue"
        value={r.investment.acquisition.estimated_revenue_gain}
        target={r.targets?.investment?.acquisition?.estimated_revenue_gain}
        symbolType="sign"
      />
      <SmallNumberBox
        name="Acquisition ROMI"
        infoTooltip="acquisition_romi"
        value={r.investment.acquisition.romi}
        target={r.targets?.investment?.acquisition?.romi}
        symbolType="multiple"
        tooltip={romi_tooltip(r.investment.acquisition)}
      />
    </ReportSection>
  );
};
const RetentionDetails = ({ report: r }) => {
  return (
    <ReportSection name="Retention">
      <SmallNumberBox
        name="Lease Renewals"
        value={r.property.leasing.renewals}
        target={r.targets?.property?.leasing?.renewals}
        delta={r.deltas?.property?.leasing?.renewals}
      />
      <SmallCurrencyShorthandBox
        name="Retention Investment"
        value={r.investment.retention.total}
        detail2={formatFourWeekAverages(
          r.four_week_funnel_averages?.ret_investment
        )}
        target={r.targets?.investment?.retention?.total}
        delta={r.deltas?.investment?.retention?.total}
      />
      <SmallCurrencyShorthandBox
        name="Est. Retained Leasing Revenue"
        value={r.investment.retention.estimated_revenue_gain}
        target={r.targets?.investment?.retention?.estimated_revenue_gain}
        symbolType="sign"
      />
      <SmallNumberBox
        name="Retention ROMI"
        infoTooltip="retention_romi"
        value={r.investment.retention.romi}
        target={r.targets?.investment?.retention?.romi}
        symbolType="multiple"
        tooltip={romi_tooltip(r.investment.retention)}
      />
    </ReportSection>
  );
};

const InvestmentAllocation = ({ acquisition, retention, report }) => {
  return (
    <div>
      <BoxRow>
        <AcquisitionDetails report={report} />
        <RetentionDetails report={report} />
      </BoxRow>
      <BoxRow>
        <InvestmentAllocationChart name="acquisition" {...acquisition} />
        <InvestmentAllocationChart name="retention" {...retention} />
      </BoxRow>
    </div>
  );
};

InvestmentAllocation.propTypes = {
  retention: PropTypes.object.isRequired,
  acquisition: PropTypes.object.isRequired
};

export default InvestmentAllocation;
