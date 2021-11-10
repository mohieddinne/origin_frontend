import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import ClientsTable from "../FoldersTable/subrow-card/ClientsTable";
import Error from "../FoldersTable/subrow-card/Error";
import LinearProgress from "@material-ui/core/LinearProgress";

const query = gql`
  query folders($id: ID!) {
    foldersClientsAndInsurers(id: $id) {
      Nom_Assure
      clients {
        NumeroClient
        NomClient
        insurers {
          NumeroAssureur
          NomAssureur
          NumeroPolice
          PourcentageRisque
          Reviseur
        }
      }
    }
  }
`;

function ClientsAndInsurersTab({ row }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data, loading, error, refetch } = useQuery(query, {
    variables: { id },
  });

  let insureds = [];
  if (data) {
    if (data.foldersClientsAndInsurers)
      insureds = data.foldersClientsAndInsurers;
  }

  if (error) return <Error retry={refetch} />;
  if (loading)
    return (
      <>
        <div className="text-center mb-16">{t("loading")}</div>
        <LinearProgress variant="query" />
      </>
    );

  return (
    <div className="w-full">
      {(insureds || []).map((item, i) => {
        return (
          <div className="px-16 py-12" key={i}>
            <div className="my-8 px-12 py-12 bg-gray-200 rounded-8">
              <span className="font-bold">Assuré(e)</span>:{" "}
              <span className="text-gray-700">
                {item.Nom_Assure ? item.Nom_Assure : t("no_insurer")}
              </span>
            </div>
            <ClientsTable loading={loading} data={item.clients} />
          </div>
        );
      })}
    </div>
  );
}
export default ClientsAndInsurersTab;
