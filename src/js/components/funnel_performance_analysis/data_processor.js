import _get from "lodash/get";

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
  funnelHistory.forEach(monthData => {
    let numberOfWeeks;
    let columnKey = monthData.month;

    // start of rows iteration
    allRows.forEach(row => {
      const weeklyAccessor = `weekly_${row.category}s.${row.path}`;
      const monthlyAccessor = `monthly_${row.category}s.${row.path}`;
      const weekValues = _get(monthData, weeklyAccessor, []);
      numberOfWeeks = numberOfWeeks || weekValues.length;

      row[columnKey] = {
        monthly: {
          value: _get(monthData, monthlyAccessor)
        },
        weekly: {
          values: weekValues,
          min: Math.min(...weekValues),
          max: Math.max(...weekValues),
          startIndex: weekIndex + 1,
          endIndex: weekIndex + numberOfWeeks
        }
      };
    });
    // end of rows iteration

    weekIndex = weekIndex + numberOfWeeks;
    // end of conversion rows iteration
  });
  // end of month iteration
}
