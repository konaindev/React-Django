import React from "react";
import { arrayOf, number, object, oneOf, shape, string } from "prop-types";
import cx from "classnames";

import "./campaign_plan_generic_tab.scss";
import CampaignPlanGenericTable from "./campaign_plan_generic_table";
import CampaignPlanGenericFooter from "./campaign_plan_generic_footer";
import {
  GENERIC_TABS,
  TACTIC_STATUSES
} from "../campaign_plan/campaign_plan.constants";
import Container from "../container";
import Panel from "../panel";

export function CampaignPlanGenericTab(props) {
  return (
    <Container>
      <Panel className="campaign-plan-generic-tab">
        <CampaignPlanGenericTable {...props} />
        <CampaignPlanGenericFooter {...props} />
      </Panel>
    </Container>
  );
}

CampaignPlanGenericTab.propTypes = {
  tabKey: oneOf(Object.keys(GENERIC_TABS)),
  tactics: arrayOf(
    shape({
      name: string,
      tooltip: string,
      schedule: string,
      status: oneOf(Object.keys(TACTIC_STATUSES)),
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
