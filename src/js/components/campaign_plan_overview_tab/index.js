import React from "react";
import { string, number, object, arrayOf, shape } from "prop-types";
import ReactMarkdown from "react-markdown";
import cx from "classnames";

import "./campaign_plan_overview_tab.scss";
import Panel from "../panel";
import { formatCurrency } from "../../utils/formatters.js";

export function CampaignPlanOverviewTab({
  target_segments,
  goal,
  objectives,
  assumptions,
  schedule,
  target,
  target_investment
}) {
  return (
    <Panel className="campaign-plan-overview-tab">
      <div className="campaign-plan-overview-table">
        <div className="table__row">
          <div className="row__label">Target Segments</div>
          <CampaignOverviewSegments
            className="row__content"
            segments={target_segments}
          />
        </div>
        <div className="table__row">
          <div className="row__label">Goal</div>
          <div
            className="row__content"
            dangerouslySetInnerHTML={{ __html: goal }}
          />
        </div>
        <div className="table__row">
          <div className="row__label">Objectives</div>
          <CampaignOverviewObjectives
            objectives={objectives}
            className="row__content"
          />
        </div>
        <div className="table__row">
          <div className="row__label">Assumptions</div>
          <div className="row__content">
            <ReactMarkdown source={assumptions} className="markdown-content" />
          </div>
        </div>
        <div className="table__row">
          <div className="row__label">Schedule</div>
          <div
            className="row__content"
            dangerouslySetInnerHTML={{ __html: schedule }}
          />
        </div>
        <div className="table__row table__row--last">
          <div className="row__label">Est. Campaign Target</div>
          <CampaignOverviewEstTarget
            className="row__content"
            target={target}
            {...target_investment}
          />
        </div>
      </div>
    </Panel>
  );
}

CampaignPlanOverviewTab.propTypes = {
  theme: string,
  target_segments: arrayOf(
    shape({
      ordinal: string,
      description: string
    })
  ),
  goal: string,
  objectives: arrayOf(
    shape({
      title: string,
      description: string
    })
  ),
  assumptions: string,
  schedule: string,
  target: string,
  target_investment: shape({
    reputation_building: string,
    demand_creation: string,
    leasing_enablement: string,
    market_intelligence: string
  })
};

export default CampaignPlanOverviewTab;

export function CampaignOverviewSegments({ segments, className }) {
  return (
    <div className={cx("target-segments", className)}>
      {segments.map(segment => (
        <div key={segment.ordinal} className="target-segment-item">
          <p>{segment.ordinal}</p>
          <p>{segment.description}</p>
        </div>
      ))}
    </div>
  );
}

export function CampaignOverviewObjectives({ objectives, className }) {
  return (
    <div className={cx("objectives-markdown", className)}>
      {objectives.map((obj, index) => (
        <div className="objective-item" key={index}>
          <h1>{obj.title}</h1>
          <ReactMarkdown
            source={obj.description}
            className="markdown-content"
          />
        </div>
      ))}
    </div>
  );
}

export function CampaignOverviewEstTarget(props) {
  return (
    <div className={cx("est-campaign-target", props.className)}>
      <h1>{formatCurrency(props.target)}</h1>
      <p>Based on Current Model</p>
      <br />

      <div className="target-investments">
        <p>
          <span>Reputation Building</span>
          <span />
          <span>{formatCurrency(props.reputation_building)}</span>
        </p>
        <p>
          <span>Demand Creation</span>
          <span />
          <span>{formatCurrency(props.demand_creation)}</span>
        </p>
        <p>
          <span>Leasing Enablement</span>
          <span />
          <span>{formatCurrency(props.leasing_enablement)}</span>
        </p>
        <p>
          <span>Marketing Intelligence</span>
          <span />
          <span>{formatCurrency(props.market_intelligence)}</span>
        </p>
      </div>
    </div>
  );
}
