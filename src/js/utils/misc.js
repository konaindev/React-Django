import {
  differenceInMilliseconds,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  differenceInCalendarYears
} from "date-fns";

export const convertToKebabCase = (string = "") => {
  return string.replace(/\s+/g, "-").toLowerCase();
};

export const convertDistanceToMeter = (distance, unit) => {
  if (unit === "mi") {
    return distance * 1609.34;
  }
  if (unit === "km") {
    return distance * 1000;
  }
  return distance;
};

/*
 * Explanation of *calendar* thing
 *
 * from: 11 March 2019 23:00:00
 *   to: 12 March 2019 00:00:00
 *
 * differenceInCalendarDays(to, from) => 1
 * differenceInDays(to, from) => 0
 */
export const getDateDiff = (startDateStr, endDateStr, unit = "month") => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const diffFunctionsMap = {
    millisecond: differenceInMilliseconds,
    second: differenceInSeconds,
    minute: differenceInMinutes,
    hour: differenceInHours,
    day: differenceInCalendarDays,
    week: differenceInCalendarWeeks,
    month: differenceInCalendarMonths,
    year: differenceInCalendarYears
  };

  const differ = diffFunctionsMap[unit] || differenceInMilliseconds;

  return differ(endDate, startDate);
};

export const getDefaultDirection = value => Math.sign(Math.round(value));

export const getPercentageDirection = value =>
  Math.sign(Math.round(value * 1000));

export const objectFromEntries = iterable => {
  return [...iterable].reduce(
    (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
    {}
  );
};
