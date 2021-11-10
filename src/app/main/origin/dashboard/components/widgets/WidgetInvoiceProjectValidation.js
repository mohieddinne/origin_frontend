import React, { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CheckIcon from "@material-ui/icons/Check";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useTranslation } from "react-i18next";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import ErrorComponent from "@catu/components/Error";
import { useHistory } from "react-router-dom";
import ProjectInvoiceNumber from "app/main/origin/components/ProjectInvoiceNumber";
import FolderNumber from "app/main/origin/components/FolderNumber";

const query = gql`
  query factures($filters: [ArrayFilterInput]) {
    factures(filters: $filters) {
      NumeroFacture
      NumeroDossier
      NomEmploye1
      MontantFacture
      DateFacturation
    }
  }
`;

function WidgetInvoiceProjectValidation() {
  const { t } = useTranslation();
  const history = useHistory();

  const columnsclient = useMemo(
    () => [
      {
        Header: t("dashApp:project_invoice.name"),
        accessor: "NumeroFacture",
        sortable: true,
        Cell: ({ cell }) => {
          return (
            <ProjectInvoiceNumber
              invoiceId={cell.value}
              value={cell.value}
              folderId={cell.row.original.NumeroDossier}
            />
          );
        },
      },
      {
        Header: t("dashApp:project_invoice.date"),
        accessor: "DateFacturation",
        sortable: true,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("dashApp:project_invoice.folder"),
        accessor: "NumeroDossier",
        sortable: true,
        Cell: ({ cell }) => <FolderNumber id={cell.value} />,
      },
      {
        Header: t("dashApp:project_invoice.resonsible"),
        accessor: "NomEmploye1",
        sortable: true,
      },
      {
        Header: t("dashApp:project_invoice.amount"),
        accessor: "MontantFacture",
        sortable: true,
      },
      {
        Header: t("dashApp:project_invoice.rule"),
        accessor: "rule",
        sortable: true,
      },
      {
        Header: "Action",
        Cell: ({ row }) => {
          return (
            <Tooltip title={t("dashApp:project_invoice.verify")}>
              <IconButton
                size="small"
                onClick={() => {
                  console.log({ row });
                  const { original } = row;
                  if (
                    original?.NumeroDossier &&
                    original?.NumeroFacture
                  ) {
                    const url = `/app/projectInvoice/item/${original.NumeroDossier}/${original.NumeroFacture}`;
                    history.push(url);
                  }
                }}
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ],
    [t, history]
  );

  const { data, loading, error } = useQuery(query, {
    variables: {
      filters: [
        { name: "project", value: "true" },
        { name: "mine", value: "true" },
      ],
    },
  });

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <EnhancedTable
      loading={loading}
      columns={columnsclient}
      data={data?.factures || []}
    />
  );
}

export default WidgetInvoiceProjectValidation;
