import React from "react";
import { useSelector } from "react-redux";
import { TextFieldFormsy, SelectFormsy, RadioGroupFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Formsy from "formsy-react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import MenuItem from "@material-ui/core/MenuItem";
import { Redirect, withRouter } from "react-router-dom";
import SectionTitle from "@catu/components/SectionTitle";

function Header(props) {
  const { t } = useTranslation();
  const ID = props.match.params.id;
  const loading = useSelector(({ clientApp }) => clientApp.form.loading);
  let data = useSelector(({ clientApp }) => clientApp.form.data);
  if (!ID) {
    data = {};
  }
  const isEditable = useSelector(({ clientApp }) => clientApp.form.isEditable);
  const isNew = useSelector(({ clientApp }) => clientApp.form.isNew);

  if (ID && !data) {
    return <Redirect to="/clients" />;
  }
  if (data && data.Inactif === true) {
    data.Inactif = "0";
  } else if (data && data.Inactif === false) {
    data.Inactif = "1";
  }
  const clientTypes = [
    "Assureur",
    "Auto-assureur",
    "Avocat",
    "Entreprise",
    "Expert en sinistres",
    "Secteur public",
  ];

  if (isEditable || isNew) {
    return (
      <Formsy ref={props.setFormRef}>
        <TextFieldFormsy
          type="hidden"
          id="id"
          name="id"
          value={ID ? ID : null}
        />
        <SectionTitle title={"cApp:create_new_client"} />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: t("error.minLength", { N: 4 }),
              }}
              required
              id="NomClient"
              name="NomClient"
              label={t("cApp:client_name")}
              value={data ? data.NomClient : null}
            ></TextFieldFormsy>
            
          </Grid>
          <Grid item xs={6}>
            <SelectFormsy
              className="w-full"
              variant="outlined"
              name="TypeClient"
              label={t("cApp:client_type")}
              value=""
            >
              <MenuItem value={""} className="text-gray italic">
                {t("cApp:none")}
              </MenuItem>
              {clientTypes.map((item, key) => (
                <MenuItem key={key} value={item}>
                  {item}
                </MenuItem>
              ))}
            </SelectFormsy>
          </Grid>

          <Grid item xs={6}>
            <SelectFormsy
              className="w-full"
              variant="outlined"
              name="Langue"
              label={t("language")}
              value={data ? data.Langue : ""}
            >
              <MenuItem value={"fr"}>{t("languages.frensh")}</MenuItem>
              <MenuItem value={"en"}>{t("languages.english")}</MenuItem>
            </SelectFormsy>
          </Grid>
          <Grid item xs={6}>
            <RadioGroupFormsy
              variant="outlined"
              value={data.Inactif ? data.Inactif : "0"}
              row
              name="Inactif"
              label={t("user.active")}
            >
              <FormControlLabel
                value={"1"}
                control={<Radio />}
                label={t("user.active")}
              />
              <FormControlLabel
                value={"0"}
                control={<Radio />}
                label={t("user.inactive")}
              />
            </RadioGroupFormsy>
          </Grid>

          <Grid item xs={12}>
            {" "}
            <SectionTitle title={t("cApp:client_info")} />
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              label={t("cApp:address")}
              validations={{
                minLength: 4,
              }}
              validationErrors={{
                minLength: t("error.minLength", { N: 4 }),
              }}
              id="Adresse"
              name="Adresse"
              value={data ? data.Adresse : ""}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextFieldFormsy
              validations={{
                minLength: 4,
                isSpecialWords: true,
              }}
              validationErrors={{
                minLength: t("error.minLength", { N: 4 }),
              }}
              className="w-full"
              variant="outlined"
              disabled={loading}
              id="Ville"
              name="Ville"
              label={t("cApp:city")}
              value={data ? data.Ville : null}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              id="CodePostal"
              name="CodePostal"
              label={t("cApp:PostalCode")}
              value={data ? data.CodePostal : null}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              label={t("cApp:courriel")}
              validations={{
                isEmail: true,
              }}
              validationErrors={{
                isEmail: "This is not a valid email",
              }}
              required
              id="Courriel"
              name="Courriel"
              value={data ? data.Courriel : ""}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              id="TelBureau"
              name="TelBureau"
              label={t("cApp:phone_number")}
              value={data ? data.TelBureau : null}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              label={t("cApp:fax_number")}
              autofocus
              id="TelFax"
              name="TelFax"
              value={data ? data.TelFax : ""}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              id="TelCellulaire"
              name="TelCellulaire"
              label={t("cApp:tel_cellulaire")}
              value={data ? data.TelCellulaire : null}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              label={t("cApp:tel_domicile")}
              autofocus
              id="TelDomicile"
              name="TelDomicile"
              value={data ? data.TelDomicile : ""}
              variant="outlined"
            />{" "}
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              id="TelAutre"
              name="TelAutre"
              label={t("cApp:tel_autre")}
              value={data ? data.TelAutre : null}
            ></TextFieldFormsy>
          </Grid>

          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              label={t("cApp:web_site")}
              autofocus
              id="SiteWeb"
              name="SiteWeb"
              value={data ? data.SiteWeb : ""}
              variant="outlined"
              validations={{
                isUrl: t("cApp:error.isUrl"),
              }}
              validationErrors={{
                isUrl: t("cApp:error.isUrl"),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {" "}
            <SectionTitle title={t("cApp:note")} />
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              multiline
              rows={3}
              type="text"
              disabled={loading}
              id="Directives"
              name="Directives"
              label={t("cApp:directives")}
              value={data ? data.Directives : ""}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              multiline
              rows={3}
              type="text"
              label={t("comment")}
              id="Commentaires"
              name="Commentaires"
              value={data ? data.Commentaires : ""}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Formsy>
    );
  } else {
    return <></>;
  }
}

export default withRouter(Header);
