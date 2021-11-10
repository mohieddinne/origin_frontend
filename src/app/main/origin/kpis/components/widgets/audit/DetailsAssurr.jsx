import React, { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useTranslation } from "react-i18next";
// import { IconButton } from "@material-ui/core";
// import VisibilityIcon from "@material-ui/icons/Visibility";

const query = gql`
  query kpis_Assureur($NumeroDossier: ID) {
    kpis_Assureur(NumeroDossier: $NumeroDossier) {
      NumeroDossier
      NumeroClient
      NumeroAssureur
      NumeroPolice
      Reviseur
      Langue
      Copies
      PourcentageRisque
      No_Dossier
      NomClient
      TypeClient
      NomAssureur
      TypeAssureur
    }
  }
`;

const DetailsAssurr = () => {
  const { t } = useTranslation();

  const { data, loading, error } = useQuery(query, {
    variables: {
      NumeroDossier: "",
    },
  });

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "NumeroDossier",
        sortable: true,
        width: "5%",
      },
      {
        Header: t("dApp:NumeroClient"),
        accessor: "NumeroClient",
        sortable: true,
        width: "20%",
      },
      {
        Header: t("dApp:NumeroAssureur"),
        accessor: "NumeroAssureur",
        sortable: true,
      },
      {
        Header: t("dApp:Reviseur"),
        accessor: "Reviseur",
        sortable: true,
      },
      {
        Header: t("dApp:NomAssureur"),
        accessor: "NomAssureur",
        sortable: true,
      },
    ],
    [t]
  );

  if (error) return "Error";

  return (
    <EnhancedTable
      loading={loading}
      columns={columns}
      data={!!data ? data.kpis_Assureur : []}
      selectable={false}
    />
  );
};
export default DetailsAssurr;
