import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Error from "@catu/components/Error";
import clsx from "clsx";
import SubRowUI from "./ClientSubrowUI";
import ClientNumber from "../../../components/ClientNumber";

const query = gql`
  query client($ids: [ID]) {
    clients(ids: $ids) {
      NumeroClient
      Inactif
      NomClient
      TypeClient
      Adresse
      Ville
      CodePostal
      Courriel
      TelBureau
      TelFax
      TelCellulaire
      TelDomicile
      TelAutre
      SiteWeb
      Langue
      Commentaires
      Directives
    }
  }
`;

const useStyles = makeStyles({
  root: {
    background: "#f4f4f4",
  },
});

function SubRow({ id }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      ids: id,
    },
  });

  let item = null;
  if (data && data.clients && data.clients[0]) {
    item = data.clients[0];
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
        <SubRowUI item={item} loading={loading} />
      </div>
      <div className="w-full p-8">
        <ClientNumber
          props={{
            variant: "contained",
            color: "primary",
            disableElevation: true,
            disabled: loading,
          }}
          component={Button}
          id={id}
          value={t("cApp:see_client_details")}
        />
      </div>
    </div>
  );
}

export default SubRow;
