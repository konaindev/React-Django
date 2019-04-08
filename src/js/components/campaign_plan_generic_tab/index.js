import React from "react";
import { arrayOf, number, object, oneOf, shape, string } from "prop-types";
import cx from "classnames";

import "./campaign_plan_generic_tab.scss";
import CampaignPlanGenericTable from "./campaign_plan_generic_table";
import Container from "../container";
import Panel from "../panel";

export function CampaignPlanGenericTab(props) {
  return (
    <Container>
      <Panel className="campaign-plan-generic-tab">
        <CampaignPlanGenericTable {...props} />
      </Panel>
    </Container>
  );
}

CampaignPlanGenericTab.propTypes = {
  tabKey: oneOf([
    "demand_creation",
    "market_intelligence",
    "reputation_building",
    "leasing_enablement"
  ]),
  tactics: arrayOf(
    shape({
      name: string,
      tooltip: string,
      schedule: string,
      status: oneOf(["not_started", "in_progress", "complete"]),
      notes: string,
      base_cost: string,
      cost_category: string,
      total_cost: string,
      volumes: shape({
        usv: number,
        inq: number
      }),
      costs: shape({
        usv: string,
        inq: string
      })
    })
  )
};

export default CampaignPlanGenericTab;
