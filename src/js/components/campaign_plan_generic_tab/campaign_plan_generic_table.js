import React from "react";
import cx from "classnames";
import ReactTable from "react-table";

import RMBTooltip from "../rmb_tooltip";
import { formatCurrency, formatNumber } from "../../utils/formatters.js";

export function CampaignPlanGenericTable({ tabKey, tactics }) {
  return (
    <ReactTable
      data={tactics}
      columns={getColumns(tabKey)}
      className={`campaign-plan-generic-table ${tabKey}`}
      defaultPageSize={tactics.length}
      showPagination={false}
      sortable={false}
      resizable={false}
    />
  );
}

export default CampaignPlanGenericTable;

function getColumns(tabKey) {
  const columnsForDemandCreation = [
    {
      Header: "Tactic",
      accessor: "name",
      width: 300,
      Cell: renderTactic
    },
    {
      Header: "Schedule",
      accessor: "schedule",
      width: 160,
      Cell: renderSchedule
    },
    {
      Header: "Status",
      accessor: "status",
      width: 120,
      Cell: renderStatus
    },
    {
      Header: "Notes/Assumptions",
      accessor: "notes",
      width: 248,
      Cell: renderNotes
    },
    {
      Header: "# Of USV",
      accessor: "volumes",
      width: 110,
      Cell: renderNoUSV
    },
    {
      Header: "# of INQ",
      accessor: "volumes",
      width: 120,
      Cell: renderNoINQ
    },
    {
      Header: "Cost",
      accessor: "costs",
      width: 260,
      Cell: renderCostWithAvg
    }
  ];

  const columnsForGeneric = [
    {
      Header: "Tactic",
      accessor: "name",
      width: 470,
      Cell: renderTactic
    },
    {
      Header: "Schedule",
      accessor: "schedule",
      width: 254,
      Cell: renderSchedule
    },
    {
      Header: "Status",
      accessor: "status",
      width: 134,
      Cell: renderStatus
    },
    {
      Header: "Notes/Assumptions",
      accessor: "notes",
      width: 304,
      Cell: renderNotes
    },
    {
      Header: "Cost",
      accessor: "total_cost",
      width: 156,
      Cell: renderCost,
      className: "text-right"
    }
  ];

  return tabKey === "demand_creation"
    ? columnsForDemandCreation
    : columnsForGeneric;
}

// Cell Renderers
function renderTactic({ value, original }) {
  const tooltip = original.tooltip;

  if (tooltip) {
    return (
      <div className="cell-tactic">
        <RMBTooltip placement="right" overlay={tooltip}>
          <span>{value}</span>
        </RMBTooltip>
      </div>
    );
  } else {
    return <div className="cell-tactic">{value}</div>;
  }
}

function renderSchedule({ value }) {
  return <div>{value}</div>;
}

function renderNotes({ value }) {
  return <div>{value}</div>;
}

function renderCost({ value }) {
  return (
    <div className="cell-metrics">
      <span>{formatCurrency(value)}</span>
    </div>
  );
}

function renderCostWithAvg({ original }) {
  const { cost_category, total_cost, base_cost } = original;
  const avgSuffixes = {
    monthly: "mo",
    weekly: "week"
  };

  if (cost_category === "one_time") {
    return (
      <div className="cell-metrics">
        <span>{formatCurrency(total_cost)}</span>
      </div>
    );
  }

  return (
    <div className="cell-metrics">
      <span>{formatCurrency(total_cost)}</span>
      <span>
        {formatCurrency(base_cost)}
        {"/"}
        {avgSuffixes[cost_category]}
      </span>
    </div>
  );
}

function renderNoUSV({ original }) {
  const { volumes = {}, costs = {} } = original;

  return (
    <div className="cell-metrics">
      <span>{formatNumber(volumes.usv)}</span>
      {costs.usv != null && (
        <span>
          {formatCurrency(costs.usv)}
          {"/USV"}
        </span>
      )}
    </div>
  );
}

function renderNoINQ({ original }) {
  const { volumes = {}, costs = {} } = original;

  return (
    <div className="cell-metrics">
      <span>{formatNumber(volumes.inq)}</span>
      {costs.inq != null && (
        <span>
          {formatCurrency(costs.inq)}
          {"/USV"}
        </span>
      )}
    </div>
  );
}

function renderStatus({ value }) {
  const statusLabels = {
    not_started: "Not Started",
    in_progress: "In Progress",
    complete: "Complete"
  };

  return <div className={`cell-status ${value}`}>{statusLabels[value]}</div>;
}
// End of Cell Renderers
