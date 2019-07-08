import PropTypes from "prop-types";
import React from "react";
import { endOfWeek, startOfYear, startOfWeek, subWeeks, parse } from "date-fns";

import DateRange from "../date_range";
import Select from "../select";
import { formatDateWithTokens } from "../../utils/formatters";

import "./date_range_selector.scss";

export default class DateRangeSelector extends React.PureComponent {
  static propTypes = {
    preset: PropTypes.oneOf([
      "custom",
      "last_week",
      "last_two_weeks",
      "last_four_weeks",
      "year_to_date"
    ]).isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    dateFormat: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {
    dateFormat: "YYYY-MM-DD"
  };

  static options = [
    { label: "Last Week", value: "last_week" },
    { label: "Last Two Weeks", value: "last_two_weeks" },
    { label: "Last Four Weeks", value: "last_four_weeks" },
    { label: "Year to Date ", value: "year_to_date" },
    { label: "Custom", value: "custom" }
  ];

  constructor(props) {
    super(props);
    this.dayPicker = React.createRef();
  }

  get startDateByPreset() {
    return {
      custom: this.props.start_date,
      last_week: subWeeks(startOfWeek(new Date()), 1),
      last_two_weeks: subWeeks(startOfWeek(new Date()), 2),
      last_four_weeks: subWeeks(startOfWeek(new Date()), 4),
      year_to_date: startOfYear(new Date())
    };
  }

  get endDateByPreset() {
    return {
      custom: this.props.end_date,
      last_week: subWeeks(endOfWeek(new Date()), 1),
      last_two_weeks: subWeeks(endOfWeek(new Date()), 1),
      last_four_weeks: subWeeks(endOfWeek(new Date()), 1),
      year_to_date: new Date()
    };
  }

  get presetValue() {
    return DateRangeSelector.options.find(o => o.value === this.props.preset);
  }

  onChangePreset = option => {
    const preset = option.value;
    const startDate = this.startDateByPreset[preset];
    const endDate = this.endDateByPreset[preset];
    if (preset === "custom") {
      this.dayPicker.current.showDayPicker();
    }
    this.props.onChange(
      preset,
      formatDateWithTokens(startDate, this.props.dateFormat),
      formatDateWithTokens(endDate, this.props.dateFormat)
    );
  };

  onChangeDate = (startDate, endDate) => {
    this.props.onChange(
      "custom",
      formatDateWithTokens(startDate, this.props.dateFormat),
      formatDateWithTokens(endDate, this.props.dateFormat)
    );
  };

  render() {
    const startDate = parse(this.props.start_date);
    const endDate = parse(this.props.end_date);
    return (
      <div className="date-range-selector">
        <Select
          className="date-range-selector__select"
          options={DateRangeSelector.options}
          value={this.presetValue}
          onChange={this.onChangePreset}
        />
        <DateRange
          className="date-range-selector__data-picker"
          startDate={startDate}
          endDate={endDate}
          onChange={this.onChangeDate}
          ref={this.dayPicker}
        />
      </div>
    );
  }
}
