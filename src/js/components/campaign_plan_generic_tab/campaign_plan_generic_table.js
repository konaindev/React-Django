import React from "react";
import ReactTable from "react-table";
import cx from "classnames";

import RMBTooltip from "../rmb_tooltip";
import {
  tacticStatusClassNames,
  getTacticStatusClass,
  getCostTypeLabel
} from "../campaign_plan/campaign_plan.constants";
import {
  formatCurrency,
  formatDateWithTokens,
  formatNumber
} from "../../utils/formatters.js";
import { convertToKebabCase } from "../../utils/misc.js";

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
      minWidth: 300,
      Cell: renderTactic,
      headerClassName: "text-left"
    },
    {
      Header: "Schedule",
      accessor: "schedule",
      width: 176,
      Cell: renderSchedule,
      headerClassName: "text-left"
    },
    {
      Header: "Status",
      accessor: "status",
      width: 136,
      Cell: renderStatus,
      headerClassName: "text-left"
    },
    {
      Header: "Notes/Assumptions",
      accessor: "notes",
      minWidth: 248,
      Cell: renderNotes,
      headerClassName: "text-left"
    },
    {
      Header: "# Of USV",
      accessor: "volumes",
      width: 112,
      Cell: renderNoUSV,
      headerClassName: "text-right"
    },
    {
      Header: "# of INQ",
      accessor: "volumes",
      width: 120,
      Cell: renderNoINQ,
      headerClassName: "text-right"
    },
    {
      Header: "Cost",
      accessor: "costs",
      minWidth: 160,
      maxWidth: 260,
      Cell: renderCostWithAvg,
      headerClassName: "text-right"
    }
  ];

  const columnsForGeneric = [
    {
      Header: "Tactic",
      accessor: "name",
      minWidth: 280,
      Cell: renderTactic,
      headerClassName: "text-left"
    },
    {
      Header: "Schedule",
      accessor: "schedule",
      width: 176,
      Cell: renderSchedule,
      headerClassName: "text-left"
    },
    {
      Header: "Status",
      accessor: "status",
      width: 136,
      Cell: renderStatus,
      headerClassName: "text-left"
    },
    {
      Header: "Notes/Assumptions",
      accessor: "notes",
      minWidth: 292,
      Cell: renderNotes,
      headerClassName: "text-left"
    },
    {
      Header: "Cost",
      accessor: "total_cost",
      minWidth: 160,
      width: 200,
      Cell: renderCost,
      headerClassName: "text-right"
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
  return <div>{formatDateWithTokens(value, "MMM D, YYYY")}</div>;
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
  const { cost_type, total_cost, base_cost } = original;

  if (cost_type === "One-Time") {
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
        {getCostTypeLabel(cost_type)}
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
  return (
    <div className={cx("cell-status", getTacticStatusClass(value))}>
      {value}
    </div>
  );
}
// End of Cell Renderers
