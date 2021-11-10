import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import { withRouter } from "react-router-dom";
import psl from "psl";
import { extractHostname } from "@catu/helpers/urls-and-domains";
import * as Actions from "../../store/actions";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import { TextFieldFormsy, SelectFormsy } from "@fuse";
import Formsy from "formsy-react";

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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const ID = props.match.params.id;
  const { data, loading, customerGroups, isEditable } = useSelector(
    ({ clientApp }) => {
      return {
        isEditable: clientApp.form.isEditable,
        data: clientApp.form.data,
        customerGroups: clientApp.form.customerGroups,
        loading: clientApp.form.loading,
      };
    }
  );

  React.useEffect(() => {
    dispatch(Actions.getClient([ID]));
    dispatch(Actions.getClientGroup());
  }, [ID, dispatch]);

  const {
    TelBureau,
    TelFax,
    TelDomicile,
    TelCellulaire,
    TelAutre,
    SiteWeb,
    NumeroClient,
    NomClient,
    Inactif,
    TypeClient,
    Adresse,
    Ville,
    CodePostal,
    Courriel,
    Langue,
    group,
  } = data || {};

  const _data = {
    TelBureau,
    TelFax,
    TelDomicile,
    TelCellulaire,
    TelAutre,
  };
  const phoneNumbers = Object.keys(_data)
    .filter((item) => !!_data[item])
    .map((item) => {
      let icon = "local_phone";
      if (item === "TelCellulaire") icon = "phone_android";
      else if (item === "TelFax") icon = "file_copy";
      else if (item === "TelDomicile") icon = "home";
      return {
        type: item.replace("Tel", ""),
        icon,
        content: _data[item],
      };
    });

  const website = {};
  if (SiteWeb) {
    website.domain = psl.get(extractHostname(SiteWeb));
    website.url = SiteWeb;
    if (SiteWeb.indexOf("http") !== 0) {
      website.url = "http://" + SiteWeb;
    }
  }

  return loading ? (
    <div className={classes.root}>
      {t("loading")}
      <LinearProgress variant="query" />
    </div>
  ) : (
    <div className="flex flex-wrap">
      <div className="flex flex-wrap w-full sm:w-1/2 md:w-1/3 pr-0 sm:pr-32 self-start">
        <div className="w-full mb-16">
          <span className="text-gray-500">
            {t("cApp:raison_social")}:
          </span>{" "}
          <div className="font-bold text-lg mb-6 leading-tight md:leading-normal">
            {NomClient}
            <Tooltip
              title={t(
                `cApp:tooltip.${Inactif ? "inactive" : "active"}`
              )}
            >
              <span
                className={`rounded-full inline-block ml-4 w-16 h-16 bg-${
                  Inactif ? "gray" : "green"
                }`}
              ></span>
            </Tooltip>
          </div>
          <span className="text-gray-700">
            ({t("cApp:ref")}# {NumeroClient})
          </span>
          {isEditable ? (
            <Formsy ref={props.setFormRef} className="mt-8">
              <TextFieldFormsy
                type="hidden"
                id="id"
                name="NumeroClient"
                value={ID ? ID : null}
              />
              <SelectFormsy
                id="customers-groups"
                value={(data.group || {}).id || ""}
                name="groupId"
                label={t("customers.group")}
                disabled={loading}
                className="w-full"
                variant="outlined"
              >
                <MenuItem value="">{t("none")}</MenuItem>
                {customerGroups &&
                  customerGroups.map((item, key) => (
                    <MenuItem value={item.id} key={key}>
                      {item.name}
                      <span
                        className="rounded-full inline-block ml-4 w-16 h-16"
                        style={{ backgroundColor: item.color }}
                      ></span>
                    </MenuItem>
                  ))}
              </SelectFormsy>
            </Formsy>
          ) : (
            group && (
              <span
                style={{ backgroundColor: group.color }}
                className="text-white text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap  mx-4"
              >
                {group.name}
              </span>
            )
          )}
        </div>

        <div className="w-full mb-16">
          <Divider />
        </div>
        <div className="w-full md:w-1/2 mb-8">
          <span className="text-gray-500">
            {t("cApp:client_type")}:
          </span>{" "}
          <span className="">{TypeClient}</span>{" "}
        </div>
        <div className="w-full md:w-1/2 mb-8">
          <span className="text-gray-500">{t("language")}:</span>{" "}
          <span className="">{Langue}</span>{" "}
        </div>
        <div className="w-full my-8">
          <Divider />
        </div>
      </div>
      <div className="flex flex-wrap w-full sm:w-1/2 md:w-2/3 pl-0 sm:pl-8">
        <div className="w-full mb-8">
          <Typography
            variant="h6"
            component="h2"
            className="mb-0 md:-mb-8"
          >
            {t("cApp:address_and_contacts")}
          </Typography>
          {/* <Typography
            variant="subtitle1"
            component="p"
            gutterBottom
            className="text-gray leading-tight md:leading-normal"
          >
            {t("cApp:address_and_contacts_subtitle")}
          </Typography> */}
        </div>
        <div className="w-full mb-16">
          <span className="text-gray-500 mb-6">
            {t("cApp:address")}:
          </span>{" "}
          <address className="not-italic">
            {Adresse}
            {Ville && `, ${Ville}`}
            {CodePostal && `, ${CodePostal}`}
            {(Adresse || Adresse || Adresse) && `, Canada`}
            {!Adresse && !Ville && !CodePostal && t("no_.address")}
          </address>
        </div>
        <span className="text-gray-500 mb-6">
          {t("cApp:contacts.index")}:
        </span>{" "}
        <div className="w-full flex flex-wrap">
          {phoneNumbers.map((item, key) => (
            <div
              className="mb-8 w-full sm:w-1/2 md:w-1/3 pr-8 last:pr-0"
              key={key}
            >
              <div className="p-8 bg-gray-100 w-full flex items-center rounded">
                <Icon
                  fontSize="large"
                  className="text-gray-500 ml-2 mr-12"
                >
                  {item.icon}
                </Icon>
                <div>
                  <span className="text-gray-500 text-xs">
                    {item.type}:
                  </span>{" "}
                  <div className="font-bold">
                    <a href={`tel:${item.content}`}>{item.content}</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {website.domain && (
            <div className="mb-8 w-full sm:w-1/2 md:w-1/3 pr-8 last:pr-0">
              <div className="p-8 bg-gray-100 w-full flex items-center rounded">
                <Icon
                  fontSize="large"
                  className="text-gray-500 ml-2 mr-12"
                >
                  insert_link
                </Icon>
                <div>
                  <span className="text-gray-500 text-xs">
                    {t("cApp:web_site")}:
                  </span>{" "}
                  <div className="font-bold truncate">
                    <a
                      href={`${website.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {website.domain}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          {Courriel && (
            <div className="mb-8 w-full sm:w-1/2 md:w-1/3 pr-8 last:pr-0">
              <div className="p-8 bg-gray-100 w-full flex items-center rounded">
                <Icon
                  fontSize="large"
                  className="text-gray-500 ml-2 mr-12"
                >
                  alternate_email
                </Icon>
                <div>
                  <span className="text-gray-500 text-xs">
                    {t("cApp:email")}:
                  </span>{" "}
                  <div className="font-bold truncate">
                    <a href={`mailto:${Courriel}`}>{Courriel}</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(Client);
