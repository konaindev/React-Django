import qs from "qs";
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
import _isBoolean from "lodash/isBoolean";
import _isEmpty from "lodash/isEmpty";
import _isNumber from "lodash/isNumber";
import _mapValues from "lodash/mapValues";

export const convertToKebabCase = (string = "") => {
  return string.replace(/\s+/g, "-").toLowerCase();
};

export const convertToSnakeCase = (string = "") => {
  return string.replace(/\s+/g, "_").toLowerCase();
};

export const convertToMeter = (distance, unit) => {
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

export const getDefaultDirection = value => {
  if (value > 0) {
    return 1;
  }
  if (value < 0) {
    return -1;
  }
  return 0;
};

export const getPercentageDirection = value =>
  Math.sign(Math.round(value * 1000));

export const objectFromEntries = iterable => {
  return [...iterable].reduce(
    (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
    {}
  );
};

/*
 * Converts backend errors to show them on UI
 */
export function convertBackendErrors(errors) {
  return _mapValues(errors, item => item[0].message);
}

/*
 * Shallow wrapper of "qs" plugin's parse() / stringify() methods
 */
export const qsParse = (queryString, hasLeadingPrefix = true) => {
  return qs.parse(queryString, { ignoreQueryPrefix: hasLeadingPrefix });
};

export const qsStringify = (queryParams, appendLeadingPrefix = true) => {
  return qs.stringify(queryParams, {
    addQueryPrefix: appendLeadingPrefix,
    arrayFormat: "repeat" // "a=1&a=2" instead of "a[0]=1&a[1]=2"
  });
};

/*
 * Strips protocol part and end slash from url string
 */
export const stripURL = url => {
  const r = /^(\w+:\/\/)(www\.)?/i;
  return url.replace(r, "").replace(/\/$/, "");
};

/*
 * Checks if all values in object are not blank
 */
export const isNotBlankValues = obj => {
  if (_isEmpty(obj)) {
    return false;
  }
  for (let v of Object.values(obj)) {
    if (!_isBoolean(v) && !_isNumber(v)) {
      if (_isEmpty(v)) {
        return false;
      }
    }
  }
  return true;
};
