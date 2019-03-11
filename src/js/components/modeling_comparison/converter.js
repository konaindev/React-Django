import { _get, calcDiffInWeeks } from "../../utils/misc";
import { convertToKebabCase } from "../../utils/misc";
import {
  formatCurrency,
  formatMultiple,
  formatNumber,
  momentFormatDate,
  formatPercent
} from "../../utils/formatters";

const formatCurrencyWithFraction = v => formatCurrency(v, true);
const formatLeasedDate = v => momentFormatDate(v, "MMM D, YYYY");

export default function(modelingOptions = []) {
  let rowsConfig = [
    {
      label: "Duration (Weeks)",
      highlight: true,
      formatter: report => {
        const duration = calcDiffInWeeks(report.dates.start, report.dates.end);
        return `${duration} Weeks`;
      }
    },
    {
      label: "95% Leased Date",
      highlight: true,
      formatter: formatLeasedDate,
      path: "dates.end"
    },
    {
      label: "Campaign Investment",
      highlight: true,
      formatter: formatCurrency,
      path: "investment.total.total"
    },
    {
      label: "Est. Revenue Change",
      highlight: true,
      formatter: formatCurrency,
      path: "investment.total.estimated_revenue_gain"
    },
    {
      label: "Weekly Est. Revenue Change",
      highlight: true,
      formatter: report => {
        const duration = calcDiffInWeeks(report.dates.start, report.dates.end);
        const value = _get(report, "investment.total.estimated_revenue_gain");

        return duration !== 0 && formatCurrency(value / duration);
      }
    },
    {
      label: "ROMI",
      highlight: true,
      formatter: formatMultiple,
      path: "investment.total.romi"
    },
    {
      label: "Leased Rate",
      formatter: formatPercent,
      path: "property.leasing.rate"
    },
    {
      label: "Retention Rate",
      formatter: formatPercent,
      path: "property.leasing.renewal_rate"
    },
    {
      label: "Occupancy Rate",
      formatter: formatPercent,
      path: "property.occupancy.rate"
    },
    {
      label: "Cancellations & Denials",
      path: "property.leasing.cds"
    },
    {
      label: "Notices to Renew",
      path: "property.leasing.renewal_notices"
    },
    {
      label: "Notices to Vacate",
      path: "property.leasing.vacation_notices"
    },
    {
      label: "Move Ins",
      path: "property.occupancy.move_ins"
    },
    {
      label: "Move Outs",
      path: "property.occupancy.move_outs"
    },
    {
      label: "Acquisition Investment",
      formatter: formatCurrency,
      path: "investment.acquisition.total"
    },
    {
      label: "Reputation Building",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.acquisition.expenses.reputation_building"
    },
    {
      label: "Demand Creation",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.acquisition.expenses.demand_creation"
    },
    {
      label: "Leasing Enablement",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.acquisition.expenses.leasing_enablement"
    },
    {
      label: "Market Intelligence",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.acquisition.expenses.market_intelligence"
    },
    {
      label: "Est. Acquired Leasing Revenue",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.acquisition.estimated_revenue_gain"
    },
    {
      label: "Acquisition ROMI",
      isChildren: true,
      formatter: v => formatMultiple(formatNumber(v)),
      path: "investment.acquisition.romi"
    },
    {
      label: "Retention Investment",
      formatter: formatCurrency,
      path: "investment.retention.total"
    },
    {
      label: "Reputation Building",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.retention.expenses.reputation_building"
    },
    {
      label: "Demand Creation",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.retention.expenses.demand_creation"
    },
    {
      label: "Leasing Enablement",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.retention.expenses.leasing_enablement"
    },
    {
      label: "Market Intelligence",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.retention.expenses.market_intelligence"
    },
    {
      label: "Est. Retained Leasing Revenue",
      isChildren: true,
      formatter: formatCurrency,
      path: "investment.retention.estimated_revenue_gain"
    },
    {
      label: "Retention ROMI",
      isChildren: true,
      formatter: v => formatMultiple(formatNumber(v)),
      path: "investment.retention.romi"
    },
    {
      label: "Unique Site Visitors (USV)",
      formatter: formatNumber,
      path: "funnel.volumes.usv"
    },
    {
      label: "Inquiries (INQ)",
      formatter: formatNumber,
      path: "funnel.volumes.inq"
    },
    {
      label: "Tours (TOU)",
      formatter: formatNumber,
      path: "funnel.volumes.tou"
    },
    {
      label: "Lease Applications (APP)",
      formatter: formatNumber,
      path: "funnel.volumes.app"
    },
    {
      label: "Lease Executions (EXE)",
      formatter: formatNumber,
      path: "funnel.volumes.exe"
    },
    {
      label: "USVs > INQ Conversion",
      formatter: formatPercent,
      path: "funnel.conversions.usv_inq"
    },
    {
      label: "INQ > TOU Conversion",
      formatter: formatPercent,
      path: "funnel.conversions.inq_tou"
    },
    {
      label: "TOU > APP Conversion",
      formatter: formatPercent,
      path: "funnel.conversions.tou_app"
    },
    {
      label: "APP > EXE Conversion",
      formatter: formatPercent,
      path: "funnel.conversions.app_exe"
    },
    {
      label: "Cost per USV",
      formatter: formatCurrencyWithFraction,
      path: "funnel.costs.usv"
    },
    {
      label: "Cost per INQ",
      formatter: formatCurrencyWithFraction,
      path: "funnel.costs.inq"
    },
    {
      label: "Cost per TOU",
      formatter: formatCurrencyWithFraction,
      path: "funnel.costs.tou"
    },
    {
      label: "Cost per APP",
      formatter: formatCurrencyWithFraction,
      path: "funnel.costs.app"
    },
    {
      label: "Cost per EXE",
      formatter: formatCurrencyWithFraction,
      path: "funnel.costs.exe"
    }
  ];

  for (let report of modelingOptions) {
    const columnKey = convertToKebabCase(report.name);

    for (let row of rowsConfig) {
      const { path, formatter } = row;
      let value;

      if (path) {
        value = _get(report, path, "");

        if (formatter) {
          value = formatter(value);
        }
      } else {
        value = formatter(report);
      }

      row[columnKey] = value;
    }
  }

  let tableRows = rowsConfig.map(row => {
    let { path, formatter, ...rest } = row;
    return rest;
  });

  return tableRows;
}
