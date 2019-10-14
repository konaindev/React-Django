import cn from "classnames";
import _isNil from "lodash/isNil";
import PropTypes from "prop-types";
import React from "react";

import ButtonToggle from "../button_toggle";
import "./email_reporting_row.scss";

class EmailReportingRow extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    groupsCount: PropTypes.number,
    propertiesCount: PropTypes.number,
    checked: PropTypes.bool,
    id: PropTypes.string,
    onToggle: PropTypes.func
  };
  static defaultProps = {
    checked: false,
    onToggle() {}
  };

  onToggle = checked => {
    this.props.onToggle(this.props.id, checked);
  };

  render() {
    const { className, title, groupsCount, propertiesCount } = this.props;
    let infoStr = "";
    if (!_isNil(groupsCount)) {
      const groupWord = groupsCount === 1 ? "Group" : "Groups";
      infoStr = `${groupsCount} ${groupWord}, `;
    }
    if (!_isNil(propertiesCount)) {
      const propsWord = propertiesCount === 1 ? "Property" : "Properties";
      infoStr += `${propertiesCount} ${propsWord}`;
    }
    let info;
    if (infoStr) {
      info = <div className="email-reporting-row__info">{infoStr}</div>;
    }

    const classes = cn("email-reporting-row", className);
    return (
      <div className={classes}>
        <div className="email-reporting-row__col">
          <div className="email-reporting-row__title">{title}</div>
          {info}
        </div>
        <div className="email-reporting-row__col email-reporting-row__col--middle">
          <ButtonToggle
            className="email-reporting-row__toggle"
            checked={this.props.checked}
            onChange={this.onToggle}
          />
        </div>
      </div>
    );
  }
}

export default EmailReportingRow;
