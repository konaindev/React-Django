import React from "react";
import PropTypes from "prop-types";

import ReportSection from "../report_section";
import Container from "../container";
import Panel from "../panel";
import Close from "../../icons/close";
import Lightning from "../../icons/lightning";
import { formatDateString } from "../../utils/formatters";

import "./insights_report.scss";

export default class InsightsReport extends React.PureComponent {
  static propTypes = {
    insights: PropTypes.arrayOf(
      PropTypes.shape({
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
      })
    ),
    onClose: PropTypes.func
  };

  static defaultProps = {
    insights: []
  };

  renderTitle = () => (
    <span className="insights-report__title">
      <Lightning className="insights-report__icon" />
      Insights
    </span>
  );

  renderClose = () => {
    if (this.props.onClose) {
      return (
        <Close
          className="insights-report__close"
          onClick={this.props.onClose}
        />
      );
    }
    return null;
  };

  renderInsights = () => {
    if (this.props.insights.length === 0) {
      return (
        <div className="insights-panel__no_insights">No insights to view.</div>
      );
    }
    const insights = this.props.insights.map((insight, i) => {
      const start = formatDateString(insight.start);
      const end = formatDateString(insight.end);
      const date = `${start} - ${end}`;
      return (
        <Panel className="insights-panel" key={`insights-panel-${i}`}>
          <div className="insights-panel__title">{date}</div>
          <div className="insights-panel__text">{insight.text}</div>
        </Panel>
      );
    });
    return <div className="insights-report__body">{insights}</div>;
  };

  render() {
    return (
      <Container className="insights-rep2ort">
        <ReportSection
          name={this.renderTitle()}
          sectionItems={this.renderClose()}
          smallMarginTop
        >
          {this.renderInsights()}
        </ReportSection>
      </Container>
    );
  }
}
