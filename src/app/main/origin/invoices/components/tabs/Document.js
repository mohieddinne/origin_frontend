import React from "react";
import { useSelector } from "react-redux";
import { TextFieldFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Formsy from "formsy-react";

import { Redirect, withRouter } from "react-router-dom";

function Document(props) {
  const { t } = useTranslation();

  const loading = useSelector(
    ({ factureReducer }) => factureReducer.form.loading
  );
  const data = useSelector(
    ({ factureReducer }) => factureReducer.form.data
  );
  /* const categoryArray = useSelector(
    ({ factureReducer }) => factureReducer.form.categoryArray
  );
  const supplierArray = useSelector(
    ({ factureReducer }) => factureReducer.form.supplierArray
  ); */
  const isEditable = useSelector(
    ({ factureReducer }) => factureReducer.form.isEditable
  );
  const isNew = useSelector(
    ({ factureReducer }) => factureReducer.form.isNew
  );

  const ID = props.match.params.id;

  if (ID && !data) {
    return <Redirect to="/app/folders/list" />;
  }
  if (isEditable || isNew) {
    return (
      <Formsy
        className="p-16 sm:p-24 max-w-2xl"
        ref={props.setFormRef}
      >
        <TextFieldFormsy
          type="hidden"
          name="id"
          id="id"
          value={(data || {}).id}
        />
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextFieldFormsy
              disabled={loading}
              label={t("materialsApp: Heures Expert")}
              autofocus
              required
              validationErrors={{
                required: t("error.form.required"),
              }}
              id="HeuresExpert"
              name="HeuresExpert"
              value={data ? data.HeuresExpert : ""}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="MontantHonoraires"
              name="MontantHonoraires"
              label={t("materialsApp:Montant Honoraires")}
              value={data ? data.MontantHonoraires : null}
              //required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={3}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="DepensesAdm"
              name="MontantHoDepensesAdmnoraires"
              label={t("materialsApp:Depenses Adm")}
              value={data ? data.DepensesAdm : null}
              //required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={3}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="AdmEnPct"
              name="AdmEnPct"
              label={t("materialsApp:Adm En Pct ")}
              value={data ? data.DepensesAdm : null}
              //required
            ></TextFieldFormsy>
          </Grid>
        </Grid>
      </Formsy>
    );
  } else {
    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={3} hidden={!isEditable}>
            <Typography className="font-bold mb-4 text-15">
              {t("materialsApp:Numero Facture")}
            </Typography>
            <Typography>
              {data && data.name ? data.name : t("not_defined")}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography className="font-bold mb-4 text-15">
              {t("materialsApp:Numero Dossier")}
            </Typography>
            <Typography>
              {data && data.category
                ? data.category
                : t("not_defined")}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography className="font-bold mb-4 text-15">
              {t("materialsApp:Date Facturation")}
            </Typography>
            <Typography>
              {data && data.supplier
                ? data.supplier
                : t("not_defined")}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(Document);
