import _get from "lodash/get";

import {
  formatNumber,
  formatPercent,
  formatDateWithTokens
} from "../../utils/formatters";
import { convertToKebabCase } from "../../utils/misc";

export default function(funnelHistory = []) {
  let allRows = [
    {
      category: "volume",
      label: "Unique Site Visitors",
      path: "usv",
      isFirstRow: true
    },
    {
      category: "volume",
      label: "Inquiries",
      path: "inq"
    },
    {
      category: "volume",
      label: "Tours",
      path: "tou"
    },
    {
      category: "volume",
      label: "Lease Applications",
      path: "app"
    },
    {
      category: "volume",
      label: "Lease Executions",
      path: "exe"
    },
    {
      category: "conversion",
      label: "USV &#8594; INQ",
      path: "usv_inq",
      isFirstRow: true,
      fixedDigits: 1
    },
    {
      category: "conversion",
      label: "INQ &#8594; TOU",
      path: "inq_tou"
    },
    {
      category: "conversion",
      label: "TOU &#8594; APP",
      path: "tou_app"
    },
    {
      category: "conversion",
      label: "APP &#8594; EXE",
      path: "app_exe"
    }
  ];

  let weekIndex = 0;

  // start of month iteration
  for (let monthFunnel of funnelHistory) {
    let numberOfWeeks;
    let columnKey = monthFunnel.month;

    // start of rows iteration
    // sets month / week values to each row for a specified month column
    for (let row of allRows) {
      const { category, path, fixedDigits } = row;
      let monthValue = _get(monthFunnel, `monthly_${category}s.${path}`);
      let weekValues = _get(monthFunnel, `weekly_${category}s.${path}`, []);
      numberOfWeeks = numberOfWeeks || weekValues.length;

      const isPercent = category === "conversion";

      // deal with "0.054" & "5.4%" resulted from "0.054384772263766146"
      if (isPercent) {
        monthValue = getRoundedValue(monthValue, fixedDigits);
        weekValues = weekValues.map(v => getRoundedValue(v, fixedDigits));
      }

      let monthValueFormatted = isPercent
        ? formatPercent(monthValue, fixedDigits)
        : formatNumber(monthValue);
      let weekValuesFormatted = weekValues.map(v =>
        isPercent ? formatPercent(v, fixedDigits) : formatNumber(v)
      );

      row[columnKey] = {
        monthly: {
          value: monthValue,
          valueFormatted: monthValueFormatted
        },
        weekly: {
          values: weekValues,
          valuesFormatted: weekValuesFormatted,
          count: numberOfWeeks,
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
    accessor: month,
    Header: formatDateWithTokens(month, "MMM")
  }));

  // start of top three percent logic, calc max
  for (let row of allRows) {
    row.key = convertToKebabCase(row.label);

    const monthValues = columns.map(({ accessor }) =>
      _get(row, `${accessor}.monthly.value`)
    );
    const weekValues = columns.reduce(
      (a, { accessor }) => a.concat(_get(row, `${accessor}.weekly.values`)),
      []
    );

    row.aggMonthly = {
      max: Math.max(...monthValues),
      topThree: getTopThreePoints(monthValues)
    };

    row.aggWeekly = {
      max: Math.max(...weekValues),
      topThree: getTopThreePoints(weekValues)
    };
  }
  // end of top three percent logic

  columns.unshift({
    accessor: "label",
    Header: ""
  });

  return {
    columns,
    volumeRows: allRows.filter(r => r.category === "volume"),
    conversionRows: allRows.filter(r => r.category === "conversion")
  };
}

function getRoundedValue(number, digits) {
  return Number.parseFloat(number).toFixed(2 + (digits || 0));
}

/**
  [1, 2, 3, 4, 5] => [3, 4, 5]
  [1, 2, 2, 3, 3] => [2, 3]
  [1, 1, 2, 2, 3, 3, 3] => [3]
**/
function getTopThreePoints(numbers) {
  const topThree = numbers.sort((a, b) => a - b).slice(-3);
  const uniqTopThree = topThree.filter(
    (elem, pos, arr) => arr.indexOf(elem) === pos
  );

  return uniqTopThree;
}
