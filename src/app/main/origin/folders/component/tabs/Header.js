import React from "react";
import { useSelector } from "react-redux";
import { TextFieldFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Formsy from "formsy-react";
import { Redirect, withRouter } from "react-router-dom";
import SectionTitle from "@catu/components/SectionTitle";
import SwitchFormsy from "@catu/components/SwitchFormsy";

function Header(props) {
  const { t } = useTranslation();
  const ID = props.match.params.id;

  const loading = useSelector(
    ({ folderApp }) => folderApp.form.loading
  );
  let data = useSelector(({ folderApp }) => folderApp.data);
  if (!ID) {
    data = {};
  }
  const isEditable = useSelector(
    ({ folderApp }) => folderApp.form.isEditable
  );
  const isNew = useSelector(({ folderApp }) => folderApp.form.isNew);
  if (ID && !data) {
    return <Redirect to="/clients" />;
  }
  if (isEditable || isNew) {
    return (
      <Formsy
        className="p-16 sm:p-24 max-w-2xl"
        ref={props.setFormRef}
      >
        <TextFieldFormsy
          type="hidden"
          id="id"
          name="id"
          value={ID ? ID : null}
        />
        <SectionTitle title={"cApp:create_new_folder"} />

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
              id="RecuPar"
              name="RecuPar"
              label={t("dApp:RecuPar")}
              value={data ? data.RecuPar : ""}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Bureau"
              name="Bureau"
              label={t("dApp:office")}
              value={data ? data.Bureau : ""}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              disabled={loading}
              label={t("dApp:repertoire")}
              id="Repertoire"
              name="Repertoire"
              value={data ? data.Repertoire : ""}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Reference"
              name="Reference"
              label={t("materialsApp:Reference")}
              value={data ? data.Reference : null}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="TypeBatiment"
              name="TypeBatiment"
              label={t("materialsApp:TypeBatiment")}
              value={data ? data.TypeDePerte : null}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              disabled={loading}
              label={t("materialsApp: VillePerte")}
              autofocus
              required
              validationErrors={{
                required: t("error.form.required"),
              }}
              id="VillePerte"
              name="VillePerte"
              value={data ? data.VillePerte : ""}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="AdressePerte"
              name="AdressePerte"
              label={t("materialsApp:AdressePerte")}
              value={data ? data.TypeDePerte : null}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              disabled={loading}
              label={t("dApp: TypeDePerte")}
              id="TypeDePerte"
              name="TypeDePerte"
              value={data ? data.TypeDePerte : ""}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="NomAssure"
              name="NomAssure"
              label={t("dApp:NomAssure")}
              value={data ? data.NomAssure : null}
            ></TextFieldFormsy>
          </Grid>
          <Grid item xs={4}>
            <TextFieldFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              type="number"
              id="FraisDestruction"
              name="FraisDestruction"
              label={t("fApp:FraisDestruction")}
              value={data ? data.FraisDestruction : 0}
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
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Proces"
              label={t("dApp:Proces")}
              value={data ? data.Proces : false}
              name="Proces"
            />
          </Grid>

          <Grid item xs={4}>
            <SwitchFormsy
              className="w-full"
              variant="outlined"
              disabled={loading}
              fullWidth
              id="Forfait"
              label={t("dApp:Forfait")}
              value={data ? data.Forfait : true}
              name="Forfait"
            />
          </Grid>
        </Grid>
      </Formsy>
    );
  }
}
export default withRouter(Header);
