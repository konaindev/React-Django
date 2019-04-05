import React from "react";
import cx from "classnames";
import ReactTable from "react-table";

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
      width: 470
    },
    {
      Header: "Schedule",
      accessor: "schedule",
      width: 254
    },
    {
      Header: "Status",
      accessor: "status",
      width: 134
    },
    {
      Header: "Notes/Assumptions",
      accessor: "notes",
      width: 304
    },
    {
      Header: "Cost",
      accessor: "costs",
      width: 156
    }
  ];

  return tabKey === "demand_creation"
    ? columnsForDemandCreation
    : columnsForGeneric;
}

export default CampaignPlanGenericTable;
