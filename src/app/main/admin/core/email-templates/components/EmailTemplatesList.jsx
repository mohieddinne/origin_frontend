import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import ViewButton from "./ViewButton";
import SwitchComponent from "./SwitchComponent";

const query = gql`
  query emailTemplates($categoryId: ID) {
    emailTemplates(categoryId: $categoryId) {
      id
      name
      slug
      active
    }
  }
`;

function EmailTemplates() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      categoryId: id,
    },
    notifyOnNetworkStatusChange: true,
  });

  let templates = [];
  if (data && Array.isArray(data.emailTemplates))
    templates = data.emailTemplates;

  const columns = useMemo(
    () => [
      {
        Header: t("emltmp:model_name", { count: templates.length }),
        accessor: "name",
        className: "font-bold",
        width: "70%",
      },
      {
        Header: t("active"),
        accessor: "active",
        width: "15%",
        Cell: ({ row }) => (
          <SwitchComponent
            id={row.original.id}
            active={row.original.active}
          />
        ),
      },
      {
        Header: t("option"),
        id: "action",
        width: "15%",
        sortable: false,
        Cell: ({ row }) => <ViewButton item={row.original} />,
      },
    ],
    [t, templates.length]
  );

  return (
    <EnhancedTable
      classesNames="min-h-full pt-8"
      loading={loading}
      columns={columns}
      data={templates}
      selectable={false}
      icon="settings"
      title={t("template_model", { count: 2 })}
      error={error}
      options={{
        refetch,
        border_top: false,
      }}
    />
  );
}

export default EmailTemplates;
