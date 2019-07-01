import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";

import { formatDateWithTokens } from "../../utils/formatters";

import "./date_range.scss";

export default class DateRange extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    dateFormat: PropTypes.string,
    isDisabled: PropTypes.bool
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
      isOpen: false
    };
  }

  handleClick = e => {
    if (!this.node.current.contains(e.target)) {
      this.hideDayPicker();
    }
  };

  onDayClick = date => {
    let startDate = this.props.startDate;
    let endDate = this.props.endDate;
    if (this.state.select === "from") {
      startDate = date;
      console.log("> ", date > this.props.endDate);
      if (date > this.props.endDate && this.props.endDate) {
        startDate = this.props.endDate;
        endDate = date;
      }
      this.props.onChange(startDate, endDate);
      this.setState({ select: "to" });
    }
    if (this.state.select === "to") {
      let endDate = date;
      if (date < this.props.startDate) {
        startDate = date;
        endDate = this.props.startDate;
      }
      this.props.onChange(startDate, endDate);
      this.setState({ select: "from" });
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
    this.setState({ isOpen: false });
  };

  renderInput = () => {
    let startDate = this.props.dateFormat;
    if (this.props.startDate) {
      startDate = formatDateWithTokens(
        this.props.startDate,
        this.props.dateFormat
      );
    }
    let endDate = this.props.dateFormat;
    if (this.props.endDate) {
      endDate = formatDateWithTokens(this.props.endDate, this.props.dateFormat);
    }
    const classNameFrom = cn("date-range__value", {
      "date-range__value--selecting":
        this.state.select === "from" && this.state.isOpen,
      "date-range__value--placeholder": !this.props.startDate
    });
    const classNameTo = cn("date-range__value", {
      "date-range__value--selecting":
        this.state.select === "to" && this.state.isOpen,
      "date-range__value--placeholder": !this.props.endDate
    });
    return (
      <div className="date-range__input" onClick={this.showDayPicker}>
        <span className={classNameFrom}>{startDate}</span>
        <span>to</span>
        <span className={classNameTo}>{endDate}</span>
      </div>
    );
  };

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

  renderEmpty = () => null;

  renderDay = (day, modifiers) => {
    const classes = cn("date-range__day", {
      "date-range__day--start": modifiers.start,
      "date-range__day--end": modifiers.end,
      "date-range__day--today": modifiers.today,
      "date-range__day--disabled": modifiers.disabled
    });
    return <div className={classes}>{day.getDate()}</div>;
  };

  render() {
    const {
      startDate,
      endDate,
      onChange,
      dateFormat,
      className,
      ...otherProps
    } = this.props;
    const modifiers = { start: startDate, end: endDate };
    const today = new Date();
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
            disabledDays: { after: today },
            toMonth: today,
            modifiers,
            numberOfMonths: 1,
            onDayClick: this.onDayClick,
            navbarElement: this.renderNavBar,
            renderDay: this.renderDay,
            captionElement: this.renderEmpty,
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
          component={this.renderInput}
          {...otherProps}
        />
      </div>
    );
  }
}
