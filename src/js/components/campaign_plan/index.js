import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../container";
import ButtonGroup from "../button_group";

import { genericTabsMap, allTabsSortedList } from "./campaign_plan.constants";
import CampaignPlanOverviewTab from "../campaign_plan_overview_tab";
import CampaignPlanGenericTab from "../campaign_plan_generic_tab";
import "./campaign_plan.scss";

const buttonOptions = allTabsSortedList.map(([key, label]) => ({
  value: key,
  label: label
}));

/**
 * @class CampaignInvestmentReport
 *
 * @classdesc Renders all metrics and graphs related to investment
 */
export default class CampaignPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "overview"
    };
  }

  onClickTab = tabKey => {
    this.setState({ activeTab: tabKey });
  };

  render() {
    const { activeTab } = this.state;
    const isOverviewTab = activeTab === "overview";
    const isGenericTab = Object.keys(genericTabsMap).includes(activeTab);
    const tabData = this.props[activeTab];

    return (
      <div className="page campaign_plan-view">
        <Container>
          <div className="campaign_plan-view__subnav">
            <ButtonGroup
              onChange={this.onClickTab}
              value={activeTab}
              options={buttonOptions}
            />
          </div>

          {isOverviewTab && tabData != null && (
            <CampaignPlanOverviewTab {...tabData} />
          )}

          {isGenericTab && tabData != null && (
            <CampaignPlanGenericTab
              {...tabData}
              tabKey={activeTab}
              key={activeTab}
            />
          )}
        </Container>
      </div>
    );
  }
}

CampaignPlan.propTypes = {
  overview: PropTypes.object.isRequired,
  reputation_building: PropTypes.object.isRequired,
  demand_creation: PropTypes.object.isRequired,
  leasing_enablement: PropTypes.object.isRequired,
  market_intelligence: PropTypes.object.isRequired
};
