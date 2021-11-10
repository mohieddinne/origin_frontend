import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useQuery, gql } from "@apollo/client";
import PercentFormatter from "@catu/components/formatters/PercentFormatter";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import FolderNumber from "../../../components/FolderNumber";

const GET_CLIENT = gql`
  query clientInvoices($clientID: ID) {
    clientInvoices(clientID: $clientID) {
      NumeroFacture
      NumeroDossier
      DateFacturation
      MontantFacture
      MontantHonoraires
      MontantDepenses
      ratio
    }
  }
`;

function Folder(props) {
  const { t } = useTranslation();

  const { loading, error, data } = useQuery(GET_CLIENT, {
    variables: { clientID: props.match.params.id },
  });

  const columns = useMemo(
    () => [
      {
        Header: t("cApp:NumeroDossier"),
        accessor: "NumeroDossier",
        sortable: true,
        Cell: ({ row, cell }) => (
          <FolderNumber
            id={row.original.NumeroDossier}
            value={cell.value}
          />
        ),
      },
      {
        Header: t("cApp:NumeroFacture"),
        accessor: "NumeroFacture",
        sortable: true,
        headersClasses: "text-center",
        className: "text-center",
        width: "15%",
        sortMethod: (a, b) => Number(a) - Number(b),
      },

      {
        Header: t("fApp:date_facturation"),
        accessor: "DateFacturation",
        headersClasses: "text-center",
        className: "text-center",
        sortable: true,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },

      {
        Header: t("kpisApp:ratio"),
        accessor: "ratio",
        headersClasses: "text-right",
        sortable: true,
        Cell: ({ cell: { value } }) => (
          <PercentFormatter
            data={value}
            className="block text-right"
          />
        ),
      },
      {
        Header: t("fApp:Montant_facture"),
        accessor: "MontantFacture",
        headersClasses: "text-right",

        sortable: true,
        Cell: ({ cell: { value } }) => (
          <MoneyFormatter
            data={value}
            className="block text-right"
            digit={0}
          />
        ),
      },
    ],
    [t]
  );

  if (error) return "error";
  return (
    <EnhancedTable
      loading={loading}
      columns={columns}
      data={data ? data.clientInvoices : []}
      selectable={false}
      dense={true}
    />
  );
}

export default withRouter(Folder);
