import React, { Component } from "react";
import PropTypes from "prop-types";

import Container from "../container";
import ButtonGroup from "../button_group";

import { GENERIC_TABS, ALL_TABS_ORDERED } from "./campaign_plan.constants";
import CampaignPlanOverviewTab from "../campaign_plan_overview_tab";
import CampaignPlanGenericTab from "../campaign_plan_generic_tab";
import "./campaign_plan.scss";

const buttonOptions = ALL_TABS_ORDERED.map(([key, label]) => ({
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
    const isGenericTab = Object.keys(GENERIC_TABS).includes(activeTab);

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

          {activeTab === "overview" && (
            <CampaignPlanOverviewTab {...this.props.overview} />
          )}

          {isGenericTab && (
            <CampaignPlanGenericTab
              {...this.props[activeTab]}
              tabKey={activeTab}
              key={activeTab}
            />
          )}
        </Container>
      </div>
    );
  }
}
