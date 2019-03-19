import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { formatDeltaPercent } from "../../utils/formatters";
import "./formatted_value_with_symbol.scss";

export function FormattedValueWithSymbol({ value, formatter, symbolType }) {
  const sign = Math.sign(+value) > 0 ? "+" : Math.sign(+value) < 0 ? "-" : "";
  const absValue = Math.abs(+value);
  const shouldShowSign =
    symbolType === "sign" || (symbolType === "multiple" && sign === "-");

  return (
    <span className="formatted-value-with-symbol">
      {shouldShowSign && (
        <span
          className={`formatted-value-with-symbol__${
            sign === "+" ? "plus" : "minus"
          }`}
        >
          {sign}
        </span>
      )}

      {formatter(shouldShowSign ? absValue : value)}

      {symbolType === "multiple" && (
        <span className="formatted-value-with-symbol__times">{"x"}</span>
      )}
    </span>
  );
}

FormattedValueWithSymbol.propTypes = {
  value: PropTypes.any.isRequired,
  formatter: PropTypes.func,
  symbolType: PropTypes.oneOf(["multiple", "sign"])
};

FormattedValueWithSymbol.defaultProps = {
  formatter: v => v
};

export default FormattedValueWithSymbol;
