import React from "react";
import { arrayOf, number, object, oneOf, shape, string } from "prop-types";
import cx from "classnames";

import "./campaign_plan_generic_tab.scss";
import CampaignPlanGenericTable from "./campaign_plan_generic_table";
import CampaignPlanGenericFooter from "./campaign_plan_generic_footer";
import {
  genericTabsMap,
  tacticStatusList,
  costTypeList
} from "../campaign_plan/campaign_plan.constants";
import Panel from "../panel";

export function CampaignPlanGenericTab(props) {
  return (
    <Panel className="campaign-plan-generic-tab">
      <CampaignPlanGenericTable {...props} />
      <CampaignPlanGenericFooter {...props} />
    </Panel>
  );
}

CampaignPlanGenericTab.propTypes = {
  tabKey: oneOf(Object.keys(genericTabsMap)),
  tactics: arrayOf(
    shape({
      name: string,
      tooltip: string,
      schedule: string,
      status: oneOf(tacticStatusList),
      notes: string,
      base_cost: string,
      cost_type: oneOf(costTypeList),
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
