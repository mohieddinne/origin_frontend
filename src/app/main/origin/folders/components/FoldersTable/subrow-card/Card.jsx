import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import FolderDetails from "./FolderDetails";
import ClientsTable from "./ClientsTable";
import Error from "./Error";

const query = gql`
  query folders($ids: [ID], $id: ID!) {
    folders(ids: $ids) {
      NumeroDossier
      Reference
      Responsable
      NomAssure
      DateLivraison
      DatePerte
      DateFerme
      RecuPar
      Budget
    }
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

const useStyles = makeStyles({
  root: {
    background: "#f4f4f4",
  },
});

function SubRow({ row }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      ids: [row.original.NumeroDossier],
      id: row.original.NumeroDossier,
    },
  });

  let item = null;
  let insureds = [];
  if (data) {
    if (data.folders && data.folders[0]) item = data.folders[0];
    if (data.foldersClientsAndInsurers)
      insureds = data.foldersClientsAndInsurers;
  }

  if (error || (!loading && !item)) return <Error retry={refetch} />;

  return (
    <div
      className={clsx(
        classes.root,
        "rounded-8 mb-16 p-8 flex flex-wrap"
      )}
    >
      <div className="w-full p-8">
        <FolderDetails item={item} loading={loading} />
      </div>
      {!loading && (
        <>
          <div className="w-full p-8 my-8">
            <div className="font-bold mb-4">
              {t("Clients_assureurs")}:
            </div>
          </div>
          <div className="w-full  p-8">
            <div className="p-12 bg-white rounded">
              {insureds.map((item) => {
                return (
                  <div>
                    <p className="my-8">
                      <span className="font-bold">{t("Assure")}</span>
                      :
                      <span className="text-gray-700">
                        {item.Nom_Assure}
                      </span>
                    </p>
                    <ClientsTable
                      loading={loading}
                      data={item.clients}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div className="w-full p-8">
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => {
            history.push(`/app/folders/item/${item.NumeroDossier}`);
          }}
        >
          {t("dApp:see_folder_details")}
        </Button>
      </div>
    </div>
  );
}
export default SubRow;
