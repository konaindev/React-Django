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
export const formatPercent = (value, decimals = 0) => {
  const formatter = Intl.NumberFormat(getLanguage(), {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
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
  while (number >= 1000) {
    number = number / 1000.0;
    levelIndex += 1;
  }
  const level = levels[levelIndex];

  // format the result as a dollar value
  const formatter = Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    useGrouping: false,
    currency
  });

  // return the result with appropriate dollar value
  return `${formatter.format(number)}${level}`;
};
