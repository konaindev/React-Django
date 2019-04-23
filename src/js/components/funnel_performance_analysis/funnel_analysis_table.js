import React from "react";
import cx from "classnames";
import ReactTable from "react-table";
import withFixedColumns from "react-table-hoc-fixed-columns";

// import "react-table-hoc-fixed-columns/lib/styles.css";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

export function FunnelAnalysisTable({ data, columns, viewMode }) {
  let tableColumns = columns.map(column => ({
    ...column,
    getProps: getColumnProps,
    width: getColumnWidth(column),
    minWidth: getColumnMinWidth(column, viewMode),
    Cell: CellRenderer
  }));

  return (
    <ReactTableFixedColumns
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
}

function getColumnWidth({ accessor }) {
  return accessor === "label" ? 140 : undefined;
}

function getColumnMinWidth({ accessor, numberOfWeeks }, viewMode) {
  if (accessor === "label") {
    return 100;
  }

  if (viewMode === "monthly") {
    return 84;
  }

  return numberOfWeeks > 4 ? 98 : 77;
}

function getColumnProps({ viewMode }) {
  return {
    extra: {
      viewMode
    }
  };
}

function CellRenderer({ value, original, column, columnProps }) {
  const {
    rest: {
      extra: { viewMode }
    }
  } = columnProps;

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
    <div className="cell-month">
      <div className="cell-month__circle-wrapper">
        <div
          className={cx("cell-month__circle", { highlight: monthHighlight })}
          style={{ width: monthCircle, height: monthCircle }}
        />
      </div>
      <div className={cx("cell-month__value", { highlight: monthHighlight })}>
        {monthValueFormatted}
      </div>
    </div>
  );
}

function CellWeekView({ cellData, rowData }) {
  const { weekStart, weekEnd, weeks } = cellData;
  const { isFirstRow } = rowData;

  return (
    <div className="cell-week">
      {isFirstRow && (
        <div className="cell-week__start-end">{`Week ${weekStart}-${weekEnd}`}</div>
      )}
      <div className="cell-week__bars">
        {weeks.map((week, index) => (
          <div
            key={index}
            style={{ height: week.barHeight }}
            className={cx({ highlight: week.highlight })}
          >
            {week.showValue && (
              <span className="cell-week__bar-value">{week.formatted}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FunnelAnalysisTable;
