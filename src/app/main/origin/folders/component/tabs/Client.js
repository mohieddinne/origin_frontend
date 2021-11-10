import React from "react";
import { useTranslation } from "react-i18next";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import ClientCard from "../misc/ClientCard";
import { useQuery, gql } from "@apollo/client";
import { withRouter } from "react-router-dom";

const query = gql`
  query foldersClient(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
  ) {
    foldersClient(ids: $ids, search: $search, filters: $filters) {
      NumeroDossier
      clients {
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
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "50px 20px",
    textAlign: "center",
    "& > div": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Client(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const ids = props.match.params.id;

  const { data, loading, error } = useQuery(query, {
    variables: { ids },
  });

  if (loading)
    return (
      <div className={classes.root}>
        {t("loading")}
        <LinearProgress variant="query" />
      </div>
    );
  else if (error) return "Error";
  else if (!data || !data.folders || data.folders.length === 0)
    return (
      <div className="w-full text-center text-gray-500 py-32">
        {t("dApp:empty_client")}
      </div>
    );

  if (!Array.isArray(data.folders.clients)) return "Aucun client";

  return data.folders.clients.map((client, key) => {
    return (
      <ClientCard
        key={client.NumeroDossier}
        data={client}
        index={key}
        total={client.length}
      />
    );
  });
}

export default withRouter(Client);
