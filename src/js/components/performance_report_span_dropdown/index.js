import React, { Component } from "react";
import PropTypes from "prop-types";
import DateRange from "../date_range";
import Select from "../select";
import { parse } from "date-fns";

import "./performance_report_span_dropdown.scss";
import { formatDateWithTokens } from "../../utils/formatters";

/**
 * @class PerformanceReportSpanDropdown
 *
 * @classname A dropdown menu that lets us change the visible performance report span.
 */
export default class PerformanceReportSpanDropdown extends Component {
  static propTypes = {
    preset: PropTypes.string,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    dateFormat: PropTypes.string,
    project: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    dateFormat: "YYYY-MM-DD"
  };

  constructor(props) {
    super(props);
    this.dayPicker = React.createRef();
    this.state = { preset: this.props.preset ? this.props.preset : "custom" };
  }

  static options = [
    { label: "Last Week", value: "last-week" },
    { label: "Last Two Weeks", value: "last-two-weeks" },
    { label: "Last Four Weeks", value: "last-four-weeks" },
    { label: "Campaign to Date", value: "campaign" },
    { label: "Custom", value: "custom" }
  ];

  get presetValue() {
    return PerformanceReportSpanDropdown.options.find(
      o => o.value === this.state.preset
    );
  }

  generateReportLink = preset => {
    return (
      "/projects/" + this.props.project.public_id + "/performance/" + preset
    );
  };

  onPresetChange = option => {
    const preset = option.value;
    if (preset !== "custom") {
      let window = this.generateReportLink(preset);
      document.location = window;
    } else if (preset === "custom") {
      this.setState({ preset: option.value });
      this.dayPicker.current.showDayPicker();
    }
  };

  onDateChange = (start, end) => {
    const startDate = formatDateWithTokens(start, this.props.dateFormat);
    const endDate = formatDateWithTokens(end, this.props.dateFormat);
    const preset = startDate + "," + endDate;
    document.location = this.generateReportLink(preset);
  };

  renderOptions() {
    // handle the case where there are no public report links
    const links = this.props.report_links || [this.props.current_report_link];

    let options = [];
    for (let link of links) {
      options.push(
        <option key={link.url} value={link.url}>
          {link.description}
        </option>
      );
    }
    return options;
  }

  render() {
    const startDate = parse(this.props.start_date);
    const endDate = parse(this.props.end_date);
    const campaignRange = {
      start: this.props.project.campaign_start,
      end: this.props.project.campaign_end
    };
    return (
      <>
        <span className="date-range-selector">
          <Select
            className="date-range-selector__select"
            theme="default"
            options={PerformanceReportSpanDropdown.options}
            value={this.presetValue}
            onChange={this.onPresetChange}
          ></Select>
          <DateRange
            className="date-range-selector__data-picker"
            onChange={this.onDateChange}
            startDate={startDate}
            endDate={endDate}
            ref={this.dayPicker}
            disabledRange={campaignRange}
          ></DateRange>
        </span>
      </>
    );
  }
}
