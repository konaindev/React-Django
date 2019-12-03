import React from "react";
import { string, number, object, arrayOf, shape } from "prop-types";
import ReactMarkdown from "react-markdown";
import cx from "classnames";
import _get from "lodash/get";

import { InfoTooltip } from "../rmb_tooltip";
import "./campaign_plan_overview_tab.scss";
import Panel from "../panel";
import { formatCurrency } from "../../utils/formatters.js";
import { convertToSnakeCase } from "../../utils/misc.js";

export function CampaignPlanOverviewTab({
  target_segments,
  goal,
  objectives,
  assumptions,
  schedule,
  target,
  target_investments
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
          <div className="row__label">Est. Campaign Investment</div>
          <CampaignOverviewEstTarget
            className="row__content"
            {...target_investments}
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
  ).isRequired,
  goal: string,
  objectives: arrayOf(
    shape({
      title: string,
      description: string
    })
  ).isRequired,
  assumptions: string,
  schedule: string,
  target_investments: shape({
    reputation_building: object,
    demand_creation: object,
    leasing_enablement: object,
    market_intelligence: object,
    total: object
  }).isRequired
};

export default CampaignPlanOverviewTab;

export function CampaignOverviewSegments({ segments, className }) {
  return (
    <div className={cx("target-segments", className)}>
      {segments.map(({ ordinal, description }) => (
        <div key={ordinal} className="target-segment-item">
          <p>
            {ordinal}
            <InfoTooltip
              transKey={`target_segments_${(ordinal || "").toLowerCase()}`}
            />
          </p>
          <p>{description}</p>
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
          <h1>
            {obj.title}
            <InfoTooltip
              transKey={`acquisition_${convertToSnakeCase(obj.title)}`}
            />
          </h1>
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
  const TT = formatCurrency(_get(props, "total.total"));
  const RB = formatCurrency(_get(props, "reputation_building.total"));
  const DC = formatCurrency(_get(props, "demand_creation.total"));
  const LE = formatCurrency(_get(props, "leasing_enablement.total"));
  const MI = formatCurrency(_get(props, "market_intelligence.total"));

  return (
    <div className={cx("est-campaign-target", props.className)}>
      <h1>{TT}</h1>
      <p>Based on Current Model</p>
      <br />

      <div className="target-investments">
        <p>
          <span>Reputation Building</span>
          <span />
          <span>{RB}</span>
        </p>
        <p>
          <span>Demand Creation</span>
          <span />
          <span>{DC}</span>
        </p>
        <p>
          <span>Leasing Enablement</span>
          <span />
          <span>{LE}</span>
        </p>
        <p>
          <span>Marketing Intelligence</span>
          <span />
          <span>{MI}</span>
        </p>
      </div>
    </div>
  );
}
