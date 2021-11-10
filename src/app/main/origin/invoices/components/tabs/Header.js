import React from "react";
import { useSelector } from "react-redux";
import { TextFieldFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Formsy from "formsy-react";
import { Redirect, withRouter } from "react-router-dom";
import SectionTitle from "@catu/components/SectionTitle";
import SwitchFormsy from "@catu/components/SwitchFormsy";
import DatePickerFormsy from "@catu/components/DatePickerFormsy";

function Header(props) {
  const { t } = useTranslation();
  const ID = props.match.params.id;
  const loading = useSelector(
    ({ factureApp }) => factureApp.form.loading
  );
  let data = useSelector(({ factureApp }) => factureApp.form.data);
  if (!ID) {
    data = {};
  }
  // if(data){
  //  moment(data.DateFacturation).format("dddd, MMMM Do YYYY, h:mm:ss a")
  data.DateFacturation = new Date(data.DateFacturation);
  // }
  const isEditable = useSelector(
    ({ factureApp }) => factureApp.form.isEditable
  );
  const isNew = useSelector(
    ({ factureApp }) => factureApp.form.isNew
  );

  if (ID && !data) {
    return <Redirect to="/app/folders/list" />;
  }
  if (isEditable || isNew) {
    return (
      <Formsy
        className="p-16 sm:p-24 max-w-2xl"
        ref={props.setFormRef}
      >
        <SectionTitle title={"fApp:create_new_facture"} />
        <Grid container spacing={1}>
          <TextFieldFormsy
            type="hidden"
            id="id"
            name="id"
            value={ID ? ID : null}
          />
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="NumeroDossier"
              name="NumeroDossier"
              label={t("fApp:folder_number")}
              value={data ? data.NumeroDossier : ""}
              required
              validations={{
                minLength: 7,
                maxLength: 7,
              }}
              validationErrors={{
                minLength: t("error.minLength", { N: 7 }),
              }}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              type="number"
              id="MontantFacture"
              name="MontantFacture"
              label={t("fApp:Montant_facture")}
              value={data ? data.MontantFacture : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <DatePickerFormsy
              className="w-full"
              name="DateFacturation"
              fullWidth
              variant="outlined"
              format="dd/MM/yyyy"
              id="date-picker-outlined"
              label={t("fApp:date_facturation")}
              value={data ? Date(data.DateFacturation) : "03/07/2029"}
            />
          </Grid>
          <Grid item xs={12}>
            <SectionTitle title={"fApp:facture_info"} />
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              type="number"
              id="HeuresExpert"
              name="HeuresExpert"
              label={t("fApp:HeuresExpert")}
              value={data ? data.HeuresExpert : 0}
              required
              validationErrors={{
                required: t("error.form.required"),
              }}
              inputProps={{
                min: 0,
                step: 0.5,
              }}
            ></TextFieldFormsy>
          </Grid>

          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              type="number"
              id="HeuresAdm"
              name="HeuresAdm"
              label={t("fApp:HeuresAdm")}
              value={data ? data.HeuresAdm : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              type="number"
              id="TauxAdm"
              name="TauxAdm"
              label={t("fApp:TauxAdm")}
              value={data ? data.TauxAdm : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              type="number"
              id="MontantAdm"
              name="MontantAdm"
              label={t("fApp:MontantAdm")}
              value={data ? data.MontantAdm : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="MontantDepenses"
              name="MontantDepenses"
              type="number"
              label={t("fApp:MontantDepenses")}
              value={data ? data.MontantDepenses : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="FF_Montant"
              type="number"
              name="FF_Montant"
              label={t("fApp:FF_Montant")}
              value={data ? data.FF_Montant : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="FF_Montant_Tot"
              name="FF_Montant_Tot"
              type="number"
              label={t("fApp:FF_Montant_Tot")}
              value={data ? data.FF_Montant_Tot : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="FF_Pct"
              name="FF_Pct"
              type="number"
              label={t("fApp:FF_Pct")}
              value={data ? data.FF_Pct : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              type="number"
              id="Id_Emp1"
              name="Id_Emp1"
              label={t("fApp:Id_Emp1")}
              value={data ? data.Id_Emp1 : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Id_Emp2"
              name="Id_Emp2"
              type="number"
              label={t("fApp:Id_Emp2")}
              value={data ? data.Id_Emp2 : 0}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="LastModifiedBy"
              name="LastModifiedBy"
              label={t("fApp:LastModifiedBy")}
              value={data ? data.LastModifiedBy : ""}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Log1"
              name="Log1"
              label={t("fApp:Log1")}
              value={data ? data.Log1 : ""}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Log2"
              name="Log2"
              label={t("fApp:Log2")}
              value={data ? data.Log2 : ""}
              required
            ></TextFieldFormsy>
          </Grid>

          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="NomEmploye1"
              name="NomEmploye1"
              label={t("fApp:NomEmploye1")}
              value={data ? data.NomEmploye1 : ""}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="NomEmploye2"
              name="NomEmploye2"
              label={t("fApp:NomEmploye2")}
              value={data ? data.NomEmploye2 : ""}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Statut"
              name="Statut"
              label={t("fApp:Statut")}
              value={data ? data.Statut : ""}
              required
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Specimen"
              name="Specimen"
              label={t("fApp:Specimen")}
              value={data ? data.Specimen : ""}
              required
            ></TextFieldFormsy>
          </Grid>

          <Grid item xs={4}>
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Adj1"
              name="Adj1"
              label={t("fApp:Adj1")}
              value={data ? data.Adj1 : false}
            />
          </Grid>

          <Grid item xs={4}>
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              id="AvecDepenses"
              fullWidth
              name="AvecDepenses"
              label={t("fApp:AvecDepenses")}
              value={data ? data.AvecDepenses : false}
            />
          </Grid>
          <Grid item xs={4}>
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Adj2"
              label={t("fApp:Adj2")}
              value={data ? data.Adj2 : false}
              name="Adj2"
            />
          </Grid>
          <Grid item xs={4}>
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              id="Ferme"
              fullWidth
              value={data ? data.Ferme : false}
              label={t("fApp:Ferme")}
              name="Ferme"
            />
          </Grid>
          <Grid item xs={4}>
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              id="CC1"
              fullWidth
              label={t("fApp:CC1")}
              value={data ? data.CC1 : false}
              name="CC1"
            />
          </Grid>

          <Grid item xs={4}>
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="CC2"
              label={t("fApp:CC2")}
              value={data ? data.CC2 : false}
              name="CC2"
            />
          </Grid>

          {/* 
          <Grid item xs={4}>
            <RadioGroupFormsy
              variant="outlined"
              value={data ? data.AdmEnPct : ""}
              row
              label={t("fApp:AdmEnPct")}
              name="AdmEnPct"
            >
              <FormControlLabel
                value={"1"}
                control={<Radio />}
                label={t("true")}
              />
              <FormControlLabel
                value={"0"}
                control={<Radio />}
                label={t("false")}
              />
            </RadioGroupFormsy>
          </Grid>
          <Grid item xs={4}>
            <RadioGroupFormsy
              variant="outlined"
              value={data ? data.DepensesAdm : ""}
              row
              label={t("fApp:DepensesAdm")}
              name="DepensesAdm"
            >
              <FormControlLabel
                value={"1"}
                control={<Radio />}
                label={t("true")}
              />
              <FormControlLabel
                value={"0"}
                control={<Radio />}
                label={t("false")}
              />
            </RadioGroupFormsy>
          </Grid>
          ******************** <Grid item xs={4}>
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="PctAdm"
              label={t("fApp:PctAdm")}
              name="PctAdm"
              value={data ? data.PctAdm : false}
            />
          </Grid>
           */}
        </Grid>
      </Formsy>
    );
  } else {
    return <></>;
  }
}

export default withRouter(Header);
