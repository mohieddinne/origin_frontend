import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useQuery, gql } from "@apollo/client";
import FolderNumber from "../../../components/FolderNumber";
import ClientNumber from "../../../components/ClientNumber";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import TextTrimer from "@catu/components/TextTrimer";

const query = gql`
  query factures($filters: [ArrayFilterInput]) {
    factures(filters: $filters, splited: true) {
      NumeroFacture
      MontantFacture
      NumeroDossier
      MontantDepenses
      MontantHonoraires
      DateFacturation
      customer {
        NumeroClient
        NomClient
        TypeClient
      }
    }
  }
`;

function Facture(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const filters = [{ name: "folders", value: id }];

  const { data, loading, error } = useQuery(query, {
    variables: { filters },
  });

  let items = [];
  if (data && Array.isArray(data.factures)) {
    items = data.factures;
  }

  const columns = React.useMemo(
    () => [
      {
        Header: t("fApp:folder_number"),
        accessor: "NumeroDossier",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => <FolderNumber id={cell.value} />,
      },
      {
        Header: t("cApp:invoice.number"),
        accessor: "NumeroFacture",
        sortable: true,
        width: "15%",
      },
      {
        Header: t("cApp:client"),
        accessor: "customer",
        sortable: false,
        Cell: ({ cell: { value } }) => (
          <ClientNumber
            id={value.NumeroClient}
            value={
              <TextTrimer string={value.NomClient} length={40} />
            }
          />
        ),
      },
      {
        Header: t("fApp:date_facturation"),
        accessor: "DateFacturation",
        sortable: true,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },

      {
        Header: t("fApp:Montant_facture"),
        accessor: "MontantFacture",
        responsive: "text-right",
        sortable: true,
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },
    ],
    [t]
  );

  return (
    <EnhancedTable
      data={items}
      columns={columns}
      loading={loading}
      error={error}
      dense={true}
      options={{ selectable: false }}
    />
  );
}

export default Facture;
