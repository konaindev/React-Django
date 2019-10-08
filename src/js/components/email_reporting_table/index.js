import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import EmailReportingRow from "../email_reporting_row";
import "./email_reporting_table.scss";

class EmailReportingTable extends React.PureComponent {
  static propTypes = {
    properties: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string,
    onLoad: PropTypes.func,
    propertiesCount: PropTypes.number,
    propertiesToggled: PropTypes.object,
    onToggleRow: PropTypes.func
  };
  static defaultProps = {
    onLoad() {},
    propertiesToggled: {},
    onToggleRow(id, value) {}
  };

  onToggleRow = (id, value) => this.props.onToggleRow(id, value);

  renderRows() {
    const rows = this.props.properties.map(item => (
      <EmailReportingRow
        className="email-reporting-table__row"
        title={item.name}
        groupsCount={item.groupsCount}
        propertiesCount={item.propertiesCount}
        checked={this.props.propertiesToggled[item.id]}
        id={item.id}
        onToggle={this.onToggleRow}
        key={item.id}
      />
    ));
    return <div className="email-reporting-table__rows">{rows}</div>;
  }

  renderButton() {
    if (this.props.propertiesCount === this.props.properties.length) {
      return;
    }
    return (
      <div className="email-reporting-table__loading">
        <Button
          className="email-reporting-table__loading-btn"
          color="secondary"
          onClick={this.props.onLoad}
        >
          View More
        </Button>
      </div>
    );
  }

  render() {
    const { properties } = this.props;
    const isData = !!properties.length;
    const classes = cn(
      "email-reporting-table",
      { "email-reporting-table--no-data": !isData },
      this.props.className
    );
    return (
      <div className={classes}>
        {isData ? this.renderRows() : "No results found."}
        {this.renderButton()}
      </div>
    );
  }
}

export default EmailReportingTable;
