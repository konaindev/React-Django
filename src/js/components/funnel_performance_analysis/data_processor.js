import _get from "lodash/get";

export default function(funnelHistory = []) {
  let volumeRows = [
    { label: "Unique Site Visitors", path: "usv" },
    { label: "Inquiries", path: "inq" },
    { label: "Tours", path: "tou" },
    { label: "Lease Applications", path: "app" },
    { label: "Lease Executions", path: "exe" }
  ];

  let conversionRows = [
    { label: "USV &#8594; INQ", path: "usv_inq" },
    { label: "INQ &#8594; TOU", path: "inq_tou" },
    { label: "TOU &#8594; APP", path: "tou_app" },
    { label: "APP &#8594; EXE", path: "app_exe" }
  ];

  let columns = [];

  // start of month iteration
  funnelHistory.forEach(monthData => {
    let weekIndex = 0,
      numberOfWeeks = 0;
    let columnKey = monthData.month;

    // start of volume rows iteration
    volumeRows.forEach(row => {
      const weekValues = _get(monthData, `weekly_volumes.${row.path}`, []);
      numberOfWeeks = weekValues.length;

      row[columnKey] = {
        monthly: {
          value: _get(monthData, `monthly_volumes.${row.path}`)
        },
        weekly: {
          values: weekValues,
          max: Math.max(...weekValues),
          startIndex: weekIndex + 1,
          endIndex: weekIndex + numberOfWeeks
        }
      };
    });
    // end of volume rows iteration

    // start of conversion rows iteration
    conversionRows.forEach(row => {
      const weekValues = _get(monthData, `weekly_conversions.${row.path}`, []);

      row[columnKey] = {
        monthly: {
          value: _get(monthData, `monthly_conversions.${row.path}`)
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

    weekIndex = weekIndex + numberOfWeeks;
    // end of conversion rows iteration
  });
  // end of month iteration
}
