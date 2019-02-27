import React from "react";

/**
 * @description Return the BCP language identifier for the current user
 */
const getLanguage = () =>
  navigator.language ||
  navigator.browserLanguage ||
  (navigator.languages || ["en-US"])[0];

/**
 * @description Convert a value (like 0.25) to a display string (25%)
 *
 * @param {number|string} value A percentage value out of 1.0 to format
 * @param {number} decimals The number of decimal places to include
 */
export const formatPercent = (value, maxFractionDigits = 0, minFractionDigits) => {

  if (minFractionDigits === undefined) {
    minFractionDigits = maxFractionDigits;
  }

  const formatter = Intl.NumberFormat(getLanguage(), {
    style: "percent",
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits
  });
  return formatter.format(value);
};

/**
 * @description Convert a value (like 4500) to a display string (4,500)
 *
 * @param {number|string} value A numerical value to format
 * @param {number} decimals The number of decimal places to include
 */
export const formatNumber = (value, decimals = 0) => {
  const formatter = Intl.NumberFormat(getLanguage(), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return formatter.format(value);
};

/**
 * @description Convert a value (like 4500) to a USD display string ($4,500)
 *
 * @param {number|string} value A numberical value to format
 * @param {boolean} cents If true, show cents
 * @param {string} currency The ISO 4217 currency code
 */
export const formatCurrency = (value, cents = false, currency = "USD") => {
  const formatter = Intl.NumberFormat(getLanguage(), {
    style: "currency",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
    currency
  });
  return formatter.format(value);
};

/**
 * @description Convert a value (like 4500) to a shorthand USD display string ($4.5k)
 *
 * @note This is always formatted in the en-US locale, because otherwise my hacknology could break.
 *
 * @param {number|string} value A numerical value to format
 * @param {string} currency The ISO 4217 currency code
 */
export const formatCurrencyShorthand = (value, currency = "USD") => {
  const levels = ["", "k", "m", "b"];

  // reduce value down to dollars, thousands, or millions of dollars
  let number = Number(value);
  let levelIndex = 0;
  while (Math.abs(number) >= 1000) {
    number = number / 1000.0;
    levelIndex += 1;
  }
  const level = levels[levelIndex];

  const maximumDigits = Math.abs(number) < 1 ? 1 : 0;

  // format the result as a dollar value
  const formatter = Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: maximumDigits,
    useGrouping: false,
    currency
  });

  // return the result with appropriate dollar value
  return `${formatter.format(number)}${level}`;
};

/**
 * @description Format a date like it's the USA!
 */
export const formatDate = (value, year = true) => {
  const options = { month: "numeric", day: "numeric" };
  if (year) {
    options.year = "2-digit";
  }
  const formatter = Intl.DateTimeFormat("en-US", options);

  // I *loathe* Javascript dates. I never get things right the first time.
  // This is a fix:
  const rawDate = new Date(value);
  const timezoneOffset = rawDate.getTimezoneOffset() * 60000;
  const d = new Date(rawDate.getTime() + timezoneOffset);

  return formatter.format(d);
};

/**
 * @description Format a multiple by putting the letter x next to it.
 *
 * @param {number|string} value A value to format
 *
 * @note This could probably use some smarts.
 */
export const formatMultiple = value => {
  return `${value}x`;
};

/**
 * @description Format the difference between two percentages as "points"
 *
 * @param {number|string} value A number of points, divided by 100, to format
 *
 * @note The `value` parameter is intended to be
 */
export const formatDeltaPercent = value => {
  const number = Number(value) * 100;
  const digits = Math.abs(number) < 1 ? 1 : 0;
  return `${formatNumber(number, digits)}pts`;
};

// XXX move this somewhere else @FIXME since it implicitly depends on React

/**
 * @description Wrap a value formatter to properly format "Target: " strings.
 *
 * @note If the underlying target value is null, we return an empty string.
 */
export const targetFormatter = formatter => targetValue =>
  targetValue == null ? (
    <span>&nbsp;</span>
  ) : (
    `Target: ${formatter(targetValue)}`
  );

export const formatTargetPercent = targetFormatter(formatPercent);
