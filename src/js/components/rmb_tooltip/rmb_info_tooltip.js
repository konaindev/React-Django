import React from "react";
import { connect } from "react-redux";
import _get from "lodash/get";

import Tooltip from "./index";
import TooltipAnchor from "./rmb_tooltip_anchor";

export const InfoTooltipBase = ({ transKey, translations }) => {
  if (!transKey) {
    return null;
  }

  // fallback to i18n key itself in case of missing i18n translation text
  let infoTooltipKey = `${transKey}.tooltip`;
  let infoTooltipCaption = translations[infoTooltipKey] || infoTooltipKey;

  return (
    <Tooltip text={infoTooltipCaption} placement="top" theme="information">
      <TooltipAnchor />
    </Tooltip>
  );
};

const mapStateToProps = state => {
  const locale = _get(state, "uiStrings.language");
  const translations = _get(state, `uiStrings.strings.${locale}`, {});

  return {
    translations
  };
};

export default connect(mapStateToProps)(InfoTooltipBase);
