import React from "react";
import { useTranslation } from "react-i18next";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";

import Subheader from "./Subheader";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import TextTrimer from "@catu/components/TextTrimer";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import AgreementDialog from "../dialog/AgreementDialog";
import ErrorComponent from "@catu/components/Error";
import SecondaryText from "@catu/components/SecondaryText";

const useStyles = makeStyles((theme) => ({
  disabledInput: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "#2196F3",
    },
  },
}));

const query = gql`
  query folders($ids: [ID]) {
    folders(ids: $ids) {
      NumeroDossier
      Reference
      Commentaire
      NomContact
      Responsable
      NomAssure
      DateLivraison
      DatePerte
      DateFerme
      RecuPar
      Budget
    }
  }
`;

function Header({ setChecked, checked }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { folderId, invoiceId } = useParams();

  const { data, loading, error } = useQuery(query, {
    variables: {
      ids: folderId,
    },
  });

  let item = null;
  if (data?.folders[0]) {
    item = data.folders[0];
  }

  if (error) {
    <ErrorComponent />;
  }

  return (
    <>
      {loading ? (
        <div className="flex p-8 mb-16 flex-1 flex-col items-center justify-center h-full">
          <Typography className="text-14 mb-8" color="textSecondary">
            {t("loading")}
          </Typography>
          <LinearProgress className="w-xs" color="secondary" />
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap w-full p-8 gap-2">
            <div
              style={{ alignItems: "baseline" }}
              className={clsx(classes.headerField, "md:w-1/4 my-4")}
            >
              <Typography className="px-4" variant="h6">
                {t("activities:responsible")}:
              </Typography>
              {item?.Responsable ? (
                <Typography variant="subtitle1" className="px-4">
                  {item.Responsable}
                </Typography>
              ) : (
                <SecondaryText
                  className="px-4"
                  text={t("not_defined")}
                />
              )}
            </div>
            <div
              style={{ alignItems: "baseline" }}
              className={clsx(classes.headerField, "md:w-1/4 my-4")}
            >
              <Typography className="px-4" variant="h6">
                {t("NumeroDossier")}:
              </Typography>
              {folderId ? (
                <Typography variant="subtitle1" className="px-4">
                  {folderId}
                </Typography>
              ) : (
                <SecondaryText
                  className="px-4"
                  text={t("not_defined")}
                />
              )}
            </div>
            <div
              style={{ alignItems: "baseline" }}
              className={clsx(classes.headerField, "md:w-1/4 my-4")}
            >
              <Typography className="px-4" variant="h6">
                {t("projectInvoice:invoice_project")}:
              </Typography>
              {invoiceId ? (
                <Typography variant="subtitle1" className="px-4">
                  {invoiceId}
                </Typography>
              ) : (
                <SecondaryText
                  className="px-4"
                  text={t("not_defined")}
                />
              )}
            </div>
            <div
              className={clsx(classes.headerField, "md:w-1/4 my-4")}
            >
              <AgreementDialog />
            </div>
          </div>
          <div className="flex p-8 m-8 w-full items-baseline">
            <Typography className="text-xl font-extrabold">
              {t("projectInvoice:reference")}:
            </Typography>
            <Typography className="flex-1 pl-4">
              <TextTrimer string={item?.Reference} length="150" />
            </Typography>
          </div>
          <Subheader
            checked={checked}
            setChecked={setChecked}
            NumeroDossier={folderId}
          />
        </div>
      )}
    </>
  );
}

export default Header;
