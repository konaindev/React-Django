import React, { Component } from "react";
import PropTypes from "prop-types";

import { formatNumber } from "../../utils/formatters";
import { InfoTooltip } from "../rmb_tooltip";
import Panel from "../panel";
import MarketSizeByIncome from "../market_size_by_income";
import "./segment_overview_by_age.scss";

export class SegmentOverviewByAge extends Component {
  static propTypes = {
    age_group: PropTypes.string.isRequired,
    income_groups: PropTypes.array.isRequired,
    segment_number: PropTypes.number.isRequired,
    segment_population: PropTypes.number.isRequired,
    total_population: PropTypes.number.isRequired
  };

  render() {
    const {
      age_group,
      income_groups,
      segment_number,
      segment_population,
      total_population
    } = this.props;
    return (
      <Panel className="segment-overview-by-age">
        <div className="segment-overview-by-age__heading">
          <div className="segment-overview-by-age__heading-left">
            Segment {segment_number} | Ages {age_group}
          </div>
          <div className="segment-overview-by-age__heading-right">
            Est. Segment Population {formatNumber(segment_population)}
            <span className="segment-overview-by-age__total-pop">
              {` / ${formatNumber(total_population)}`}
            </span>
            <InfoTooltip transKey="est_segment_population" />
          </div>
        </div>
        <div className="segment-overview-by-age__content">
          {income_groups.map((item, index) => (
            <MarketSizeByIncome
              key={index}
              {...item}
              segment_population={segment_population}
            />
          ))}
        </div>
      </Panel>
    );
  }
}

export default SegmentOverviewByAge;
