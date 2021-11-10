import React from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import Switch from "./Switch";

const gQlQuery = gql`
  query roles($ids: [Int]) {
    roles(ids: $ids) {
      id
      accesses {
        id
        name
        slug
        can_view
        can_view_own
        can_edit
        can_create
        can_delete
        allow_view
        allow_view_own
        allow_edit
        allow_create
        allow_delete
      }
    }
  }
`;

function AccessesTable({ match: { params } }) {
  const { t } = useTranslation();

  const id = parseInt(params.id);

  const { loading, error, data, refetch } = useQuery(gQlQuery, {
    variables: { ids: [id] },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    skip: !id,
  });

  const rows =
    (data && data.roles && data.roles[0] && data.roles[0].accesses) ||
    [];

  const columns = React.useMemo(
    () => [
      {
        Header: t("access:access", { count: 2 }),
        accessor: "name",
        className: "font-bold",
      },
      {
        Header: t("access:see"),
        accessor: "can_view",
        headersClasses: "text-center",
        Cell: (props) => <ControlCell id={id} {...props} />,
      },
      {
        Header: t("access:see_own"),
        accessor: "can_view_own",
        headersClasses: "text-center",
        Cell: (props) => <ControlCell id={id} {...props} />,
      },
      {
        Header: t("create"),
        accessor: "can_create",
        headersClasses: "text-center",
        Cell: (props) => <ControlCell id={id} {...props} />,
      },
      {
        Header: t("edit"),
        accessor: "can_edit",
        headersClasses: "text-center",
        Cell: (props) => <ControlCell id={id} {...props} />,
      },
      {
        Header: t("delete"),
        accessor: "can_delete",
        headersClasses: "text-center",
        Cell: (props) => <ControlCell id={id} {...props} />,
      },
    ],
    [id, t]
  );

  return (
    <EnhancedTable
      classesNames="min-h-full pt-8"
      loading={loading || !id}
      columns={columns}
      data={rows}
      selectable={false}
      icon="settings"
      title={t("access:access", { count: 2 })}
      description={t("access:accesses_description")}
      error={error}
      options={{
        border_top: false,
        refetch,
      }}
    />
  );
}

// Render the Switch component
function ControlCell({ id, value, column, row }) {
  const privilege = column.id.replace("can_", "");
  const allow = row.original[`allow_${privilege}`];
  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <Switch
        disabled={!allow}
        value={value}
        role={id}
        slug={row.original.slug}
        privilege={column.id}
      />
    </div>
  );
}

export default withRouter(AccessesTable);
