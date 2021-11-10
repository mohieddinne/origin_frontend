import React from "react";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import psl from "psl";
import { extractHostname } from "@catu/helpers/urls-and-domains";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import ClientNumber from "../../../components/ClientNumber";

const useStyles = makeStyles(() => ({
  card: {
    background: "#fafafa",
    border: "1px solid #e2e2e2",
  },
}));

function ClientCard({ data }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const _data = (data.clients || [])[0] || [];

  const contacts = [
    "TelBureau",
    "TelCellulaire",
    "TelFax",
    "TelDomicile",
    "TelAutre",
  ];
  const phoneNumbers = Object.keys(_data || [])
    .filter((item) => !!_data[item] && contacts.includes(item))
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
  if (_data.SiteWeb) {
    website.domain = psl.get(extractHostname(_data.SiteWeb));
    website.url = _data.SiteWeb;
    if (_data.SiteWeb.indexOf("http") !== 0) {
      website.url = "http://" + _data.SiteWeb;
    }
  }

  return (
    <div
      className={clsx(
        "flex flex-wrap m-12 rounded-8 p-16",
        classes.card
      )}
    >
      <div className="flex flex-wrap w-full sm:w-1/2 md:w-1/3 pr-0 sm:pr-32 self-start">
        <div className="w-full mb-16">
          <span className="text-gray-700">
            {t("dApp:client_name")}:
          </span>{" "}
          <div className="font-bold text-lg mb-6 leading-tight md:leading-normal">
            <ClientNumber
              id={_data.NumeroClient}
              value={_data.NomClient}
              component="span"
            />
            <Tooltip
              title={t(
                `cApp:tooltip.${
                  _data.Inactif ? "inactive" : "active"
                }`
              )}
            >
              <span
                className={clsx(
                  "rounded-full inline-block ml-4 w-16 h-16",
                  {
                    "bg-gray": _data.Inactif,
                    "bg-green": !_data.Inactif,
                  }
                )}
              ></span>
            </Tooltip>
          </div>
          <span className="text-gray-700">
            {t("cApp:ref")}# <ClientNumber id={_data.NumeroClient} />
          </span>
        </div>
        <div className="w-full mb-16">
          <Divider />
        </div>
        <div className="w-full md:w-1/2 mb-8">
          <span className="text-gray-600">
            {t("cApp:client_type")}:
          </span>{" "}
          <span className="">{_data.TypeClient}</span>{" "}
        </div>
        <div className="w-full md:w-1/2 mb-8">
          <span className="text-gray-600">{t("language")}:</span>{" "}
          <span className="">{_data.Langue}</span>{" "}
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
          <Typography
            variant="subtitle1"
            component="p"
            gutterBottom
            className="text-gray leading-tight md:leading-normal"
          >
            {t("cApp:address_and_contacts_subtitle")}
          </Typography>
        </div>
        <div className="w-full mb-16">
          <span className="text-gray-600">{t("cApp:address")}:</span>{" "}
          <span className="">
            {_data.Adresse},
            <br />
            {_data.Ville}, {_data.CodePostal}, Canada
          </span>
        </div>
        {_data.Commentaires && (
          <div className="w-full mb-16">
            <span className="text-gray-600">{t("comment")}:</span>{" "}
            <p>{_data.Commentaires}</p>
          </div>
        )}

        <div className="w-full flex flex-wrap">
          {phoneNumbers.map((item, key) => (
            <div
              className="mb-8 w-full sm:w-1/2 md:w-1/3 pr-8 last:pr-0"
              key={key}
            >
              <div className="p-8 bg-gray-200 w-full flex items-center rounded">
                <Icon
                  fontSize="large"
                  className="text-gray-700 ml-2 mr-12"
                >
                  {item.icon}
                </Icon>
                <div>
                  <span className="text-gray-700 text-xs">
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
                  className="text-gray-700 ml-2 mr-12"
                >
                  insert_link
                </Icon>
                <div>
                  <span className="text-gray-700 text-xs">
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
          {_data.Courriel && (
            <div className="mb-8 w-full sm:w-1/2 md:w-1/3 pr-8 last:pr-0">
              <div className="p-8 bg-gray-200 w-full flex items-center rounded">
                <Icon
                  fontSize="large"
                  className="text-gray-700 ml-2 mr-12"
                >
                  alternate_email
                </Icon>
                <div>
                  <span className="text-gray-700 text-xs">
                    {t("cApp:email")}:
                  </span>{" "}
                  <div className="font-bold truncate">
                    <a href={`mailto:${_data.Courriel}`}>
                      {_data.Courriel}
                    </a>
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

export default ClientCard;
