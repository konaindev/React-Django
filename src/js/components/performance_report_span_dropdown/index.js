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
    campaignRange: PropTypes.object,
    onChange: PropTypes.func.isRequired
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

  onPresetChange = option => {
    const preset = option.value;
    this.setState({ preset: preset });
    if (preset !== "custom") {
      this.props.onChange(preset);
    } else if (preset === "custom") {
      this.dayPicker.current.showDayPicker();
    }
  };

  onDateChange = (start, end) => {
    const startDate = formatDateWithTokens(start, this.props.dateFormat);
    const endDate = formatDateWithTokens(end, this.props.dateFormat);
    const rangeString = startDate + "," + endDate;
    this.props.onChange(this.state.preset, rangeString);
  };

  render() {
    const startDate = parse(this.props.start_date);
    const endDate = parse(this.props.end_date);
    const campaignRange = this.props.campaignRange;
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
