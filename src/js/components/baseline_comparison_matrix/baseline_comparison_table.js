import React, { Component, Fragment } from "react";
import ReactTable from "react-table";
import cx from "classnames";
import get from "lodash/get";
import isNil from "lodash/isNil";

import Panel from "../panel";
import { getDateDiff } from "../../utils/misc";
import {
  formatCurrency,
  formatCurrencyShorthand,
  formatDateWithTokens,
  formatMultiple,
  formatNumber,
  formatPercent
} from "../../utils/formatters";

const tableMap = [
  {
    label: "Location",
    getValue: report =>
      report.address ? `${report.address.city}, ${report.address.state}` : ""
  },
  {
    label: "Date",
    getValue: report =>
      `${formatDateWithTokens(
        report.dates.start,
        "MMM 'YY"
      )} - ${formatDateWithTokens(report.dates.end, "MMM 'YY")}`
  },
  {
    label: "Baseline Duration (Months)",
    getValue: report =>
      getDateDiff(report.dates.start, report.dates.end, "month"),
    formatter: value => `${value} Months`
  },
  {
    label: "Number of Units",
    getValue: "property.total_units",
    formatter: value => formatNumber(value)
  },
  {
    label: "Min. Monthly Rental ($)",
    getValue: "property.lowest_monthly_rent",
    formatter: value => formatCurrency(value)
  },
  {
    label: "Max. Monthly Rental ($)",
    getValue: "property.highest_monthly_rent",
    formatter: value => formatCurrency(value)
  },
  {
    label: "Avg. Cost per Sqft ($)",
    getValue: "property.average_monthly_rent",
    formatter: value => formatCurrency(value)
  },
  {
    label: "Campaign Investment",
    getValue: "investment.total.total",
    formatter: value => formatCurrencyShorthand(value)
  },
  {
    label: "Estimated Revenue Change",
    getValue: "investment.total.estimated_revenue_gain",
    formatter: value => formatCurrencyShorthand(value)
  },
  {
    label: "ROMI",
    getValue: "investment.total.romi",
    formatter: value => formatMultiple(formatNumber(value))
  },
  {
    label: "Leased Rate",
    getValue: "property.leasing.rate",
    formatter: value => formatPercent(value)
  },
  {
    label: "Retention Rate",
    getValue: "property.leasing.renewal_rate",
    formatter: value => formatPercent(value)
  },
  {
    label: "Occupancy Rate",
    getValue: "property.occupancy.rate",
    formatter: value => formatPercent(value)
  },
  {
    label: "Cancellation & Denial Rate",
    getValue: "property.leasing.cd_rate",
    formatter: value => formatPercent(value)
  },
  {
    label: "Notices to Renew",
    getValue: "property.leasing.renewal_notices",
    formatter: value => formatNumber(value)
  },
  {
    label: "Notices to Vacate",
    getValue: "property.leasing.vacation_notices",
    formatter: value => formatNumber(value)
  },
  {
    label: "Move Ins",
    getValue: "property.occupancy.move_ins",
    formatter: value => formatNumber(value)
  },
  {
    label: "Move Outs",
    getValue: "property.occupancy.move_outs",
    formatter: value => formatNumber(value)
  },
  {
    label: "Unique Site Visitors (USV)",
    getValue: "funnel.volumes.usv",
    formatter: value => formatNumber(value)
  },
  {
    label: "Inquiries (INQ)",
    getValue: "funnel.volumes.inq",
    formatter: value => formatNumber(value)
  },
  {
    label: "Tours (TOU)",
    getValue: "funnel.volumes.tou",
    formatter: value => formatNumber(value)
  },
  {
    label: "Lease Applications (APP)",
    getValue: "funnel.volumes.app",
    formatter: value => formatNumber(value)
  },
  {
    label: "Lease Executions (EXE)",
    getValue: "funnel.volumes.exe",
    formatter: value => formatNumber(value)
  },
  {
    label: "USV > EXE",
    formatter: value => formatPercent(value),
    getValue: "funnel.conversions.usv_exe"
  },
  {
    label: "INQ > TOU",
    formatter: value => formatPercent(value),
    getValue: "funnel.conversions.inq_tou"
  },
  {
    label: "TOU > APP",
    formatter: value => formatPercent(value),
    getValue: "funnel.conversions.tou_app"
  },
  {
    label: "APP > EXE",
    formatter: value => formatPercent(value),
    getValue: "funnel.conversions.app_exe"
  },
  {
    label: "Cost Per USV",
    formatter: value => formatCurrency(value, true),
    getValue: "funnel.costs.usv"
  },
  {
    label: "Cost Per INQ",
    formatter: value => formatCurrency(value, true),
    getValue: "funnel.costs.inq"
  },
  {
    label: "Cost Per TOU",
    formatter: value => formatCurrency(value, true),
    getValue: "funnel.costs.tou"
  },
  {
    label: "Cost Per APP",
    formatter: value => formatCurrency(value, true),
    getValue: "funnel.costs.app"
  },
  {
    label: "Cost Per EXE",
    formatter: value => formatCurrency(value),
    getValue: "funnel.costs.exe"
  }
];

const getData = reports =>
  tableMap.map((row, rowIndex) => {
    const values = reports.map(report =>
      typeof row.getValue === "function"
        ? row.getValue(report)
        : get(report, row.getValue)
    );
    return values.reduce(
      (acc, value, index) => {
        acc[`value_${index}`] =
          row.formatter && !isNil(value) ? row.formatter(value) : value;
        if (value) {
          acc.sum += Number(value);
        }
        return acc;
      },
      { label: row.label, sum: 0, index: rowIndex }
    );
  });

const getColumns = reports => [
  {
    Header: "",
    accessor: "label"
  },
  ...reports.map((report, index) => ({
    Header:
      index === 0 ? (
        <Fragment>
          {report.property_name}
          <br />
          Campaign
        </Fragment>
      ) : (
        `Anonymous ${index}`
      ),
    accessor: `value_${index}`,
    headerClassName: "text-right",
    className: "baseline-comparison-table__value-cell"
  })),
  {
    Header: (
      <Fragment>
        Cross-Sample
        <br />
        Average
      </Fragment>
    ),
    id: "average",
    headerClassName: "text-right",
    className: "baseline-comparison-table__value-cell",
    accessor: d => {
      const formatter = tableMap[d.index].formatter;
      return formatter ? formatter(d.sum / (reports.length || 1)) : "";
    }
  }
];

const BaselineComparisonTable = ({ reports }) => (
  <Panel className="baseline-comparison-panel">
    <ReactTable
      data={getData(reports)}
      columns={getColumns(reports)}
      className="baseline-comparison-table"
      defaultPageSize={tableMap.length}
      showPagination={false}
      sortable={false}
      resizable={false}
    />
  </Panel>
);

export default BaselineComparisonTable;
