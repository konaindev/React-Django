import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";

import Button from "../button";
import { formatDateWithTokens } from "../../utils/formatters";

import "./date_range.scss";

export default class DateRange extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    dateFormat: PropTypes.string,
    isDisabled: PropTypes.bool,
    disabledRange: PropTypes.object
  };

  static defaultProps = {
    dateFormat: "MM/DD/YY",
    isDisabled: false
  };

  constructor(props) {
    super(props);
    this.dayPicker = React.createRef();
    this.node = React.createRef();
    this.state = {
      select: "from",
      isOpen: false,
      startDate: props.startDate,
      endDate: props.endDate
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.endDate !== this.props.endDate ||
      prevProps.startDate !== this.props.startDate
    ) {
      this.setState({
        startDate: this.props.startDate,
        endDate: this.props.endDate
      });
    }
  }

  renderNavBar = ({ month, onPreviousClick, onNextClick }) => {
    const monthStr = formatDateWithTokens(month, "MMMM YYYY");
    return (
      <div className="date-range__nav-bar">
        <div
          className="date-range__nav-button date-range__nav-button--prev"
          onClick={() => onPreviousClick()}
        />
        <div className="date-range__current-month">{monthStr}</div>
        <div
          className="date-range__nav-button date-range__nav-button--next"
          onClick={() => onNextClick()}
        />
      </div>
    );
  };

  renderFooter = () => {
    return (
      <div className="date-range__footer">
        <Button className="date-range__button" onClick={this.onCancel}>
          Cancel
        </Button>
        <Button
          className="date-range__button"
          color="primary"
          onClick={this.onApply}
        >
          Apply
        </Button>
      </div>
    );
  };

  renderDay = (day, modifiers) => {
    const classes = cn("date-range__day", {
      "date-range__day--start": modifiers.start,
      "date-range__day--end": modifiers.end,
      "date-range__day--today": modifiers.today,
      "date-range__day--disabled": modifiers.disabled
    });
    return <div className={classes}>{day.getDate()}</div>;
  };

  getDisabledRange = () => {
    const response_range = {
      after: new Date()
    };
    if ("disabledRange" in this.props) {
      const start = new Date(this.props.disabledRange.campaign_start);
      const end =
        "campaign_end" in this.props.disabledRange
          ? new Date(this.props.disabledRange.campaign_end)
          : new Date();
      response_range.after = end;
      response_range.before = start;
    }
    return response_range;
  };

  handleClick = e => {
    if (!this.node.current.contains(e.target)) {
      this.hideDayPicker();
    }
  };

  showDayPicker = () => {
    if (!this.props.isDisabled) {
      document.addEventListener("mousedown", this.handleClick, false);
      this.dayPicker.current.showDayPicker();
      this.setState({ isOpen: true });
    }
  };

  hideDayPicker = () => {
    document.removeEventListener("mousedown", this.handleClick, false);
    this.dayPicker.current.hideDayPicker();
    this.setState({ isOpen: false, select: "from" });
  };

  onCancel = () => {
    this.setState({
      startDate: this.props.startDate,
      endDate: this.props.endDate
    });
    this.hideDayPicker();
  };

  onApply = () => {
    this.props.onChange(this.state.startDate, this.state.endDate);
    this.hideDayPicker();
  };

  onDayClick = date => {
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
    if (this.state.select === "from") {
      startDate = date;
      if (date > this.state.endDate && this.state.endDate) {
        startDate = this.state.endDate;
        endDate = date;
      }
      this.setState({ startDate, endDate, select: "to" });
    }
    if (this.state.select === "to") {
      let endDate = date;
      if (date < this.state.startDate) {
        startDate = date;
        endDate = this.state.startDate;
      }
      this.setState({ startDate, endDate, select: "from" });
    }
  };

  render() {
    const { className } = this.props;
    const { startDate, endDate } = this.state;
    const modifiers = { start: startDate, end: endDate };
    const disabledRange = this.getDisabledRange();
    const classes = cn("date-range", className);
    return (
      <div className={classes} ref={this.node}>
        <DayPickerInput
          ref={this.dayPicker}
          classNames={{
            overlay: "",
            overlayWrapper: "date-range__overlay-wrapper"
          }}
          dayPickerProps={{
            selectedDays: [startDate, { from: startDate, to: endDate }],
            disabledDays: disabledRange,
            month: disabledRange.after,
            toMonth: disabledRange.after,
            fromMonth: disabledRange.before,
            modifiers,
            numberOfMonths: 1,
            onDayClick: this.onDayClick,
            navbarElement: this.renderNavBar,
            renderDay: this.renderDay,
            captionElement: this.renderFooter,
            classNames: {
              container: "date-range__day-picker",
              wrapper: "date-range__month-wrapper",
              month: "date-range__month",
              weekdaysRow: "date-range__weekdays",
              weekday: "date-range__weekday",
              weekdays: "",
              body: "date-range__days",
              week: "date-range__week",
              day: "date-range__day-wrapper",
              today: "today",
              selected: "date-range__day-wrapper--selected",
              start: "date-range__day-wrapper--start",
              disabled: "disabled",
              outside: "date-range__day-wrapper--outside"
            }
          }}
          hideOnDayClick={false}
          component={DateRangeInput}
          inputProps={{
            dateFormat: this.props.dateFormat,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            select: this.state.select,
            isOpen: this.state.isOpen,
            showDayPicker: this.showDayPicker
          }}
        />
      </div>
    );
  }
}

class DateRangeInput extends React.PureComponent {
  render() {
    const {
      dateFormat,
      startDate,
      endDate,
      isOpen,
      select,
      showDayPicker
    } = this.props;
    let startDateStr = dateFormat;
    if (startDate) {
      startDateStr = formatDateWithTokens(startDate, dateFormat);
    }
    let endDateStr = dateFormat;
    if (endDate) {
      endDateStr = formatDateWithTokens(endDate, dateFormat);
    }
    const classNameFrom = cn("date-range__value", {
      "date-range__value--selecting": select === "from" && isOpen,
      "date-range__value--placeholder": !startDate
    });
    const classNameTo = cn("date-range__value", {
      "date-range__value--selecting": select === "to" && isOpen,
      "date-range__value--placeholder": !endDate
    });
    return (
      <div className="date-range__input" onClick={showDayPicker}>
        <span className={classNameFrom}>{startDateStr}</span>
        <span>to</span>
        <span className={classNameTo}>{endDateStr}</span>
      </div>
    );
  }
}
