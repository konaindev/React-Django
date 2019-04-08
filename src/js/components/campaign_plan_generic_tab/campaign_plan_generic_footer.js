import React from "react";
import _get from "lodash/get";

import { formatCurrency, formatNumber } from "../../utils/formatters.js";

export function CampaignPlanGenericFooter({ tabKey, tactics }) {
  const totalLabel = getTotalLabel(tabKey);

  return (
    <div className="campaign-plan-generic-footer">
      <p className="footer__total">
        {totalLabel}
        {" Total: "}
        {formatCurrency(getTotal(tactics))}
      </p>
      {tabKey === "demand_creation" && (
        <React.Fragment>
          <p className="footer__subtotal">
            {"Total Number of USV: "}
            {formatNumber(getTotalUSV(tactics))}
          </p>
          <p className="footer__subtotal">
            {"Total Number of INQ: "}
            {formatNumber(getTotalINQ(tactics))}
          </p>
        </React.Fragment>
      )}
    </div>
  );
}

CampaignPlanGenericFooter.defaultProps = {
  tactics: []
};

export default CampaignPlanGenericFooter;

function getTotal(tactics) {
  return tactics.reduce((acc, each) => acc + parseFloat(each.total_cost), 0);
}

function getTotalUSV(tactics) {
  return tactics.reduce(
    (acc, each) => acc + parseFloat(_get(each, "volumes.usv", 0)),
    0
  );
}

function getTotalINQ(tactics) {
  return tactics.reduce(
    (acc, each) => acc + parseFloat(_get(each, "volumes.inq", 0)),
    0
  );
}

function getTotalLabel(tabKey) {
  const labels = {
    demand_creation: "Demand Creation",
    market_intelligence: "Marketing Intelligence",
    reputation_building: "Reputation Building",
    leasing_enablement: "Leasing Enablement"
  };

  return labels[tabKey];
}
