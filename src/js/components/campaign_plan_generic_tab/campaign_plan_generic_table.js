import React from "react";
import cx from "classnames";
import ReactTable from "react-table";

import { formatCurrency } from "../../utils/formatters.js";

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

function getColumns(tabKey) {
  const columnsForDemandCreation = [
    {
      Header: "Tactic",
      accessor: "name",
      width: 300
    },
    {
      Header: "Schedule",
      accessor: "schedule",
      width: 160
    },
    {
      Header: "Status",
      accessor: "status",
      width: 116
    },
    {
      Header: "Notes/Assumptions",
      accessor: "notes",
      width: 248
    },
    {
      Header: "# Of USV",
      accessor: "volumes",
      width: 110,
      Cell: () => <div />
    },
    {
      Header: "# of INQ",
      accessor: "volumes",
      width: 120,
      Cell: () => <div />
    },
    {
      Header: "Cost",
      accessor: "costs",
      width: 260,
      Cell: () => <div />
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
      Cell: renderCost
    }
  ];

  return tabKey === "demand_creation"
    ? columnsForDemandCreation
    : columnsForGeneric;
}

const renderTactic = ({ value }) => <div>{value}</div>;
const renderSchedule = ({ value }) => <div>{value}</div>;
const renderStatus = ({ value }) => {
  const statusLabels = {
    not_started: "Not Started",
    in_progress: "In Progress",
    complete: "Complete"
  };
  return <div className={`cell-status ${value}`}>{statusLabels[value]}</div>;
};
const renderNotes = ({ value }) => <div>{value}</div>;
const renderCost = ({ value }) => {
  return <div>{formatCurrency(value)}</div>;
};

export default CampaignPlanGenericTable;
