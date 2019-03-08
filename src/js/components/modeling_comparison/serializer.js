import {
  formatCurrency,
  formatDate,
  formatMultiple,
  formatNumber,
  formatPercent
} from "../../utils/formatters";

export default function(modelingOptions = []) {
  let columns = modelingOptions.map(o => o.name);
  let optionsByName = {};

  for (let { name, ...rest } of modelingOptions) {
    optionsByName[name] = rest;
  }

  let rows = [
    { id: "1", label: "Duration (Weeks)", highlight: true },
    { id: "2", label: "95% Leased Date", highlight: true },
    { id: "3", label: "Campaign Investment", highlight: true },
    { id: "4", label: "Est. Revenue Change", highlight: true },
    { id: "5", label: "Weekly Est. Revenue Change", highlight: true },
    { id: "6", label: "ROMI", highlight: true },
    { id: "7", label: "Leased Rate" },
    { id: "8", label: "Retention Rate" },
    { id: "9", label: "Occupancy Rate" },
    { id: "10", label: "Cancellations & Denials" },
    { id: "11", label: "Notices to Renew" },
    { id: "12", label: "Notices to Vacate" },
    { id: "13", label: "Move Ins" },
    { id: "14", label: "Move Outs" },
    { id: "15", label: "Acquisition Investment" },
    { id: "15.1", label: "Reputation Building", isChildren: true },
    { id: "15.2", label: "Demand Creation", isChildren: true },
    { id: "15.3", label: "Leasing Enablement", isChildren: true },
    { id: "15.4", label: "Market Intelligence", isChildren: true },
    { id: "15.5", label: "Est. Acquired Leasing Revenue", isChildren: true },
    { id: "15.6", label: "Acquisition ROMI", isChildren: true },
    { id: "16", label: "Retention Investment" },
    { id: "16.1", label: "Reputation Building", isChildren: true },
    { id: "16.2", label: "Demand Creation", isChildren: true },
    { id: "16.3", label: "Leasing Enablement", isChildren: true },
    { id: "16.4", label: "Market Intelligence", isChildren: true },
    { id: "16.5", label: "Est. Retained Leasing Revenue", isChildren: true },
    { id: "16.6", label: "Retention ROMI", isChildren: true },
    { id: "17", label: "Unique Site Visitors (USV)" },
    { id: "18", label: "Inquiries (INQ)" },
    { id: "19", label: "Tours (TOU)" },
    { id: "20", label: "Lease Applications (INQ)" },
    { id: "21", label: "Lease Executions (EXE)" },
    { id: "22", label: "USVs > INQ Conversion" },
    { id: "23", label: "INQ > TOU Conversion" },
    { id: "24", label: "TOU > APP Conversion" },
    { id: "25", label: "APP > EXE Conversion" },
    { id: "26", label: "Cost per USV" },
    { id: "27", label: "Cost per INQ" },
    { id: "28", label: "Cost per TOU" },
    { id: "29", label: "Cost per APP" },
    { id: "30", label: "Cost per EXE" }
  ];

  for (let column of columns) {
    let option = optionsByName[column];
    let {
      dates,
      four_week_funnel_averages,
      funnel,
      investment,
      property,
      name
    } = option;

    const duration_in_weeks = 121; // calculate from dates.start, dates.end
    setValue(rows, "1", column, `${121} Weeks`);
    setValue(rows, "2", column, formatDate(dates.end));
    setValue(rows, "3", column, formatCurrency(investment.total.total));
    setValue(
      rows,
      "4",
      column,
      formatCurrency(investment.total.estimated_revenue_gain)
    );
    setValue(
      rows,
      "4",
      column,
      formatCurrency(investment.total.estimated_revenue_gain)
    );
    setValue(
      rows,
      "5",
      column,
      formatCurrency(
        investment.total.estimated_revenue_gain / duration_in_weeks
      )
    );
    setValue(rows, "6", column, formatMultiple(investment.total.romi));
    setValue(rows, "7", column, formatPercent(property.leasing.rate));
    setValue(rows, "8", column, formatPercent(property.leasing.renewal_rate));
    setValue(rows, "9", column, formatPercent(property.occupancy.rate));
    setValue(rows, "10", column, property.leasing.cds);
    setValue(rows, "11", column, property.leasing.renewal_notices);
    setValue(rows, "12", column, property.leasing.vacation_notices);
    setValue(rows, "13", column, property.occupancy.move_ins);
    setValue(rows, "14", column, property.occupancy.move_outs);

    setValue(rows, "15", column, formatCurrency(investment.acquisition.total));
    setValue(
      rows,
      "15.1",
      column,
      formatCurrency(investment.acquisition.expenses.reputation_building)
    );
    setValue(
      rows,
      "15.2",
      column,
      formatCurrency(investment.acquisition.expenses.demand_creation)
    );
    setValue(
      rows,
      "15.3",
      column,
      formatCurrency(investment.acquisition.expenses.leasing_enablement)
    );
    setValue(
      rows,
      "15.4",
      column,
      formatCurrency(investment.acquisition.expenses.market_intelligence)
    );
    setValue(
      rows,
      "15.5",
      column,
      formatCurrency(investment.acquisition.estimated_revenue_gain)
    );
    setValue(
      rows,
      "15.6",
      column,
      formatMultiple(formatNumber(investment.acquisition.romi))
    );

    setValue(rows, "16", column, formatCurrency(investment.retention.total));
    setValue(
      rows,
      "16.1",
      column,
      formatCurrency(investment.retention.expenses.reputation_building)
    );
    setValue(
      rows,
      "16.2",
      column,
      formatCurrency(investment.retention.expenses.demand_creation)
    );
    setValue(
      rows,
      "16.3",
      column,
      formatCurrency(investment.retention.expenses.leasing_enablement)
    );
    setValue(
      rows,
      "16.4",
      column,
      formatCurrency(investment.retention.expenses.market_intelligence)
    );
    setValue(
      rows,
      "16.5",
      column,
      formatCurrency(investment.retention.estimated_revenue_gain)
    );
    setValue(
      rows,
      "16.6",
      column,
      formatMultiple(formatNumber(investment.retention.romi))
    );

    setValue(rows, "17", column, formatNumber(funnel.volumes.usv));
    setValue(rows, "18", column, formatNumber(funnel.volumes.inq));
    setValue(rows, "19", column, formatNumber(funnel.volumes.tou));
    setValue(rows, "20", column, formatNumber(funnel.volumes.app));
    setValue(rows, "21", column, formatNumber(funnel.volumes.exe));
    setValue(rows, "22", column, formatPercent(funnel.conversions.usv_inq));
    setValue(rows, "23", column, formatPercent(funnel.conversions.inq_tou));
    setValue(rows, "24", column, formatPercent(funnel.conversions.tou_app));
    setValue(rows, "25", column, formatPercent(funnel.conversions.app_exe));
    setValue(rows, "26", column, formatCurrency(funnel.costs.usv, true));
    setValue(rows, "27", column, formatCurrency(funnel.costs.inq, true));
    setValue(rows, "28", column, formatCurrency(funnel.costs.tou, true));
    setValue(rows, "29", column, formatCurrency(funnel.costs.app, true));
    setValue(rows, "30", column, formatCurrency(funnel.costs.exe, true));
  }

  return { columns, rows };
}

function setValue(rows = [], id, column, value) {
  const row = rows.find(r => r.id === id);
  if (row) {
    row[column] = value;
  }
}
