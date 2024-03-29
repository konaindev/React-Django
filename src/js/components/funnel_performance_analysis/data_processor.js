import _get from "lodash/get";

import {
  formatNumber,
  formatPercent,
  formatDateWithTokens
} from "../../utils/formatters";
import { convertToKebabCase } from "../../utils/misc";

/**
  exampleCell = {
    monthCircle: "95%", // width & height of circle
    monthHighlight: false, // highlight circle
    monthValue: 1797, // original value used in top three logic
    monthValueFormatted: "1,797", // value to display
    weeksCount: 5,
    weekEnd: 52, // label in weekly cell
    weekStart: 48, // label in weekly cell
    weeks: [{
      value: 775, // original or level-1 formatted value used in top three logic
      formatted: "775", // value to display
      highlight: true, // highlight bar
      showValue: true, // show value on top of bar
      barHeight: "98%" // height of bar
    }, {
      ...
    }]
  }

  resultRows = [{
    category: "volume",
    isFirstRow: true,     // show "Week 1-4" label in weekly view
    key: "unique-site-visitors",
    label: "Unique Site Visitors",
    metric: "usv" // accessor in the raw data
    "2017-08": cell1,
    "2017-09": cell2,
    ...
    "2018-07": exampleCell
  }, {
    ...
  }]
**/
export default function(funnelHistory = []) {
  let allRows = [
    {
      category: "volume",
      label: "Unique Site Visitors",
      metric: "usv",
      isFirstRow: true
    },
    {
      category: "volume",
      label: "Inquiries",
      metric: "inq"
    },
    {
      category: "volume",
      label: "Tours",
      metric: "tou"
    },
    {
      category: "volume",
      label: "Lease Applications",
      metric: "app"
    },
    {
      category: "volume",
      label: "Lease Executions",
      metric: "exe"
    },
    {
      category: "conversion",
      label: "USV &#8594; INQ",
      metric: "usv_inq",
      isFirstRow: true,
      fixedDigits: 1
    },
    {
      category: "conversion",
      label: "INQ &#8594; TOU",
      metric: "inq_tou"
    },
    {
      category: "conversion",
      label: "TOU &#8594; APP",
      metric: "tou_app"
    },
    {
      category: "conversion",
      label: "APP &#8594; EXE",
      metric: "app_exe"
    }
  ];

  let columns = funnelHistory.map(({ month }) => ({
    month,
    accessor: month,
    Header: formatDateWithTokens(month, "MMM")
  }));

  let weekIndex = 0;

  // start of month iteration
  for (let monthFunnel of funnelHistory) {
    let numberOfWeeks;

    // start of rows iteration
    // sets month / week values to each row for a specified month column
    for (let row of allRows) {
      const { category, metric, fixedDigits } = row;
      let monthValue = _get(monthFunnel, `monthly_${category}s.${metric}`, 0);
      let weekValues = _get(monthFunnel, `weekly_${category}s.${metric}`, []);
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
      let weeks = weekValues.map(v => ({
        value: v,
        formatted: isPercent ? formatPercent(v, fixedDigits) : formatNumber(v)
      }));

      row[monthFunnel.month] = {
        monthValue,
        monthValueFormatted,
        weeks,
        weeksCount: numberOfWeeks,
        weekStart: weekIndex + 1,
        weekEnd: weekIndex + numberOfWeeks
      };
    }
    // end of rows iteration

    const columnInfo = columns.find(c => c.month === monthFunnel.month);
    if (columnInfo) {
      columnInfo.numberOfWeeks = numberOfWeeks;
    }

    weekIndex = weekIndex + numberOfWeeks;
  }
  // end of month iteration

  // start of top three percent logic, calc max
  for (let row of allRows) {
    row.key = convertToKebabCase(row.label);

    const periodMonthValues = columns.map(({ month }) => row[month].monthValue);
    const periodWeekValues = columns.reduce(
      (acc, { month }) => acc.concat(row[month].weeks.map(w => w.value)),
      []
    );

    const maxMonthValueInPeriod = Math.max(...periodMonthValues);
    const topThreeMonthValues = getTopThreePoints(periodMonthValues);
    const maxWeekValueInPeriod = Math.max(...periodWeekValues);
    const topThreeWeekValues = getTopThreePoints(periodWeekValues);

    // each cell
    for (let { month } of columns) {
      const monthValue = row[month].monthValue;

      row[month] = {
        ...row[month],
        monthCircle: `${(monthValue / maxMonthValueInPeriod) * 100}%`,
        monthHighlight: topThreeMonthValues.indexOf(monthValue) >= 0
      };

      // highlight eligible weeks to top three
      // show only one value label per month, not enough space in cells
      for (let week of row[month].weeks) {
        week.highlight = topThreeWeekValues.indexOf(week.value) >= 0;
        week.barHeight = `${(week.value / maxWeekValueInPeriod) * 100}%`;
        week.showValue = false;
      }

      let fourWeekMax = Math.max(...row[month].weeks.map(w => w.value));
      let weekWithMax = row[month].weeks.find(
        w => w.highlight && w.value == fourWeekMax
      );
      if (weekWithMax) {
        weekWithMax.showValue = true;
      }
    }
  }
  // end of top three percent logic

  columns.unshift({
    accessor: "label",
    Header: "",
    className: "sticky-column",
    headerClassName: "sticky-column"
  });

  return {
    columns,
    volumeRows: allRows.filter(r => r.category === "volume"),
    conversionRows: allRows.filter(r => r.category === "conversion")
  };
}

function getRoundedValue(number, digits = 0) {
  return +Number.parseFloat(number).toFixed(digits + 2);
}

/**
  [1, 2, 3, 4, 5] => [3, 4, 5]
  [1, 2, 2, 3, 3] => [2, 3]
  [1, 1, 2, 2, 3, 3, 3] => [3]
**/
function getTopThreePoints(numbers) {
  return (
    numbers
      .sort((a, b) => b - a)
      // pick three in the sorted numbers
      .slice(0, 3)
      // remove duplicates among three
      .filter((elem, pos, arr) => arr.indexOf(elem) === pos)
      // remove zero or negative, just in case
      .filter(v => v > 0)
  );
}
