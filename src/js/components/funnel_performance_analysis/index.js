import React from "react";
import { string, number, object, array, arrayOf, shape } from "prop-types";
import cx from "classnames";
import ReactTable from "react-table";

import "./funnel_performance_analysis.scss";
import processData from "./data_processor";
import Container from "../container";
import SectionHeader from "../section_header";
import Panel from "../panel";
import ButtonGroup from "../button_group";
import { formatNumber, formatPercent } from "../../utils/formatters";

export class FunnelPerformanceAnalysis extends React.Component {
  constructor(props) {
    super(props);

    const { columns, volumeRows, conversionRows } = processData(
      props.funnelHistory
    );

    this.state = {
      viewMode: "monthly",
      columns,
      volumeRows,
      conversionRows
    };

    this.buttonGroupOptions = [
      {
        value: "monthly",
        label: "Monthly"
      },
      {
        value: "weekly",
        label: "Weekly"
      }
    ];
  }

  static Legends = ({ viewMode }) => {
    return (
      <div className="analysis__legends">
        <span>Lower</span>
        {viewMode === "monthly" && (
          <div className="legends__chart legends__chart--monthly">
            <span />
            <span />
            <span />
          </div>
        )}
        {viewMode === "weekly" && (
          <div className="legends__chart legends__chart--weekly">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        <span>Higher</span>
        <span className="legends__top-label">Top 3 Points</span>
        <span className="legends__top-box" />
      </div>
    );
  };

  static Table = ({ data, columns, viewMode }) => {
    let tableColumns = columns.map(c => ({
      ...c,
      minWidth: getCellMinWidth(c.accessor, viewMode),
      Cell: props => <CellRenderer {...props} viewMode={viewMode} />
    }));

    return (
      <ReactTable
        data={data}
        columns={tableColumns}
        className={`analysis__table analysis__table--${viewMode}`}
        defaultPageSize={data.length}
        showPagination={false}
        sortable={false}
        resizable={false}
        viewMode={viewMode}
      />
    );
  };

  handleChangeViewMode = viewMode => {
    this.setState({ viewMode });
  };

  render() {
    const { viewMode, columns, volumeRows, conversionRows } = this.state;

    return (
      <Container className="funnel-performance-analysis">
        <SectionHeader title="Funnel Performance Analysis" />

        <Panel>
          <div className="analysis__panel-header">
            <ButtonGroup
              onChange={this.handleChangeViewMode}
              value={viewMode}
              options={this.buttonGroupOptions}
            />

            <FunnelPerformanceAnalysis.Legends viewMode={viewMode} />
          </div>

          <p className="analysis__table-intro">Volume of Activity</p>
          <FunnelPerformanceAnalysis.Table
            data={volumeRows}
            columns={columns}
            viewMode={viewMode}
          />

          <p className="analysis__table-intro">Conversion Rate</p>
          <FunnelPerformanceAnalysis.Table
            data={conversionRows}
            columns={columns}
            viewMode={viewMode}
          />
        </Panel>
      </Container>
    );
  }
}

FunnelPerformanceAnalysis.propTypes = {
  funnelHistory: arrayOf(
    shape({
      month: string,
      monthly_volumes: shape({
        usv: number,
        inq: number,
        tou: number,
        app: number,
        exe: number
      }).isRequired,
      weekly_volumes: shape({
        usv_inq: array,
        inq_tou: array,
        tou_app: array,
        app_exe: array,
        usv_exe: array
      }).isRequired,
      monthly_conversions: shape({
        usv: number,
        inq: number,
        tou: number,
        app: number,
        exe: number
      }).isRequired,
      weekly_conversions: shape({
        usv_inq: array,
        inq_tou: array,
        tou_app: array,
        app_exe: array,
        usv_exe: array
      }).isRequired,
      monthly_costs: object,
      weekly_costs: object
    })
  ).isRequired
};

function getCellMinWidth(accessor, viewMode) {
  if (accessor === "label") {
    return 140;
  }

  if (viewMode === "monthly") {
    return 84;
  }

  return 78;
}

function CellRenderer(props) {
  const { value, original, column, viewMode } = props;
  // console.log("+++++++++", props);

  if (column.id === "label") {
    return <div dangerouslySetInnerHTML={{ __html: value }} />;
  }

  if (viewMode === "monthly") {
    return <CellMonthView cellData={value} />;
  }

  if (viewMode === "weekly") {
    return <CellWeekView cellData={value} rowData={original} />;
  }
}

function CellMonthView({ cellData }) {
  const { monthValueFormatted, monthCircle, monthHighlight } = cellData;

  return (
    <div className="cell-monthly">
      <div className="cell-monthly__circle-wrapper">
        <div
          className={cx("cell-monthly__circle", {
            "cell-monthly__circle--highlight": monthHighlight
          })}
          style={{ width: monthCircle, height: monthCircle }}
        />
      </div>
      <div
        className={cx("cell-monthly__value", {
          "cell-monthly__value--highlight": monthHighlight
        })}
      >
        {monthValueFormatted}
      </div>
    </div>
  );
}

function CellWeekView({ cellData, rowData }) {
  const { weekStart, weekEnd, weeks } = cellData;
  const { isFirstRow } = rowData;

  return (
    <div className="cell-weekly">
      {isFirstRow && (
        <div className="cell-weekly__label">{`Week ${weekStart}-${weekEnd}`}</div>
      )}
      <div className="cell-weekly__bars">
        {weeks.map((week, index) => {
          return (
            <div
              key={index}
              style={{ height: week.barHeight }}
              className={cx({ highlight: week.highlight })}
            >
              {week.showValue && (
                <span className="cell-weekly__value">{week.formatted}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FunnelPerformanceAnalysis;
