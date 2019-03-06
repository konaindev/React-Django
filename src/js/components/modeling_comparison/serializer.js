import {
  formatNumber,
  formatPercent,
  formatCurrency
} from "../../utils/formatters";

export default function(modelingOptions = []) {
  let columns = [];
  let rowsData = {};

  for (let option of modelingOptions) {
    let label, data;
    let {
      dates,
      four_week_funnel_averages,
      funnel,
      investment,
      property,
      name
    } = option;

    columns.push(name);

    label = "Duration (Weeks)";
    rowsData[label] = rowsData[label] || [];
    const duration_in_weeks = 121; // calculate from dates.start, dates.end
    rowsData[label].push(`${duration} Weeks`);

    label = "95% Leased Date";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(dates.end);

    label = "Campaign Investment";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatCurrency(investment.total.total));

    label = "Est. Revenue Change";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.total.estimated_revenue_gain)
    );

    label = "Weekly Est. Revenue Change";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(
        investment.total.estimated_revenue_gain / duration_in_weeks
      )
    );

    label = "ROMI";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(`${investment.total.romi}X`);

    label = "Leased Rate";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatPercent(property.leasing.rate));

    label = "Retention Rate";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatPercent(property.leasing.renewal_rate));

    label = "Occupancy Rate";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatPercent(property.occupancy.rate));

    label = "Cancellations & Denials";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(property.leasing.cds);

    label = "Notices to Renew";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(property.leasing.renewal_notices);

    label = "Notices to Vacate";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(property.leasing.vacation_notices);

    label = "Move Ins";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(property.occupancy.move_ins);

    label = "Move Outs";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(property.occupancy.move_outs);

    label = "Acquisition Investment";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatCurrency(investment.acquisition.total));

    label = "Reputation Building";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.acquisition.expenses.reputation_building)
    );

    label = "Demand Creation";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.acquisition.expenses.demand_creation)
    );

    label = "Leasing Enablement";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.acquisition.expenses.leasing_enablement)
    );

    label = "Market Intelligence";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.acquisition.expenses.market_intelligence)
    );

    label = "Est. Acquired Leasing Revenue";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.acquisition.estimated_revenue_gain)
    );

    label = "Acquisition ROMI";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(`${formatNumber(investment.acquisition.romi)}X`);

    label = "Retention Investment";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatCurrency(investment.retention.total));

    label = "Reputation Building";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.retention.expenses.reputation_building)
    );

    label = "Demand Creation";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.retention.expenses.demand_creation)
    );

    label = "Leasing Enablement";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.retention.expenses.leasing_enablement)
    );

    label = "Market Intelligence";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.retention.expenses.market_intelligence)
    );

    label = "Est. Acquired Leasing Revenue";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(
      formatCurrency(investment.retention.estimated_revenue_gain)
    );

    label = "Retention ROMI";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(`${formatNumber(investment.retention.romi)}X`);

    label = "Unique Site Visitors (USV)";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatNumber(funnel.volumes.usv));

    label = "Inquiries (INQ)";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatNumber(funnel.volumes.inq));

    label = "Tours (TOU)";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatNumber(funnel.volumes.tou));

    label = "Lease Applications (INQ)";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatNumber(funnel.volumes.app));

    label = "Lease Executions (EXE)";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatNumber(funnel.volumes.exe));

    label = "USVs > INQ Conversion";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatPercent(funnel.conversions.usv_inq));

    label = "INQ > TOU Conversion";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatPercent(funnel.conversions.inq_tou));

    label = "TOU > APP Conversion";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatPercent(funnel.conversions.tou_app));

    label = "APP > EXE Conversion";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatPercent(funnel.conversions.app_exe));

    label = "Cost per USV";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatCurrency(funnel.costs.usv, true));

    label = "Cost per INQ";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatCurrency(funnel.costs.inq, true));

    label = "Cost per TOU";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatCurrency(funnel.costs.tou, true));

    label = "Cost per APP";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatCurrency(funnel.costs.app, true));

    label = "Cost per EXE";
    rowsData[label] = rowsData[label] || [];
    rowsData[label].push(formatCurrency(funnel.costs.exe, true));
  }
}
