import _get from "lodash/get";

import { formatDateWithTokens } from "../../utils/formatters";
import { convertToKebabCase } from "../../utils/misc";

export default function(funnelHistory = []) {
  let allRows = [
    { category: "volume", label: "Unique Site Visitors", path: "usv" },
    { category: "volume", label: "Inquiries", path: "inq" },
    { category: "volume", label: "Tours", path: "tou" },
    { category: "volume", label: "Lease Applications", path: "app" },
    { category: "volume", label: "Lease Executions", path: "exe" },
    { category: "conversion", label: "USV &#8594; INQ", path: "usv_inq" },
    { category: "conversion", label: "INQ &#8594; TOU", path: "inq_tou" },
    { category: "conversion", label: "TOU &#8594; APP", path: "tou_app" },
    { category: "conversion", label: "APP &#8594; EXE", path: "app_exe" }
  ];

  let weekIndex = 0;

  // start of month iteration
  for (let monthFunnel of funnelHistory) {
    let numberOfWeeks;
    let columnKey = monthFunnel.month;

    // start of rows iteration
    for (let row of allRows) {
      const weeklyAccessor = `weekly_${row.category}s.${row.path}`;
      const monthlyAccessor = `monthly_${row.category}s.${row.path}`;
      const weekValues = _get(monthFunnel, weeklyAccessor, []);
      numberOfWeeks = numberOfWeeks || weekValues.length;

      row[columnKey] = {
        monthly: {
          value: _get(monthFunnel, monthlyAccessor)
        },
        weekly: {
          values: weekValues,
          min: Math.min(...weekValues),
          max: Math.max(...weekValues),
          startIndex: weekIndex + 1,
          endIndex: weekIndex + numberOfWeeks
        }
      };
    }
    // end of rows iteration

    weekIndex = weekIndex + numberOfWeeks;
  }
  // end of month iteration

  let columns = funnelHistory.map(({ month }) => ({
    key: month,
    label: formatDateWithTokens(month, "MMM")
  }));

  // start of min/max evaluation
  for (let row of allRows) {
    const monthValues = columns.map(({ key }) =>
      _get(row, `${key}.monthly.value`)
    );
    const weekValues = columns.reduce(
      (a, { key }) => a.concat(_get(row, `${key}.weekly.values`)),
      []
    );

    row.monthly = {
      min: Math.min(...monthValues),
      max: Math.max(...monthValues)
    };

    row.weekly = {
      min: Math.min(...weekValues),
      max: Math.max(...weekValues)
    };

    row.key = convertToKebabCase(row.label);
  }
  // end of min/max evaluation

  console.log(allRows);
  console.log(columns);
}
