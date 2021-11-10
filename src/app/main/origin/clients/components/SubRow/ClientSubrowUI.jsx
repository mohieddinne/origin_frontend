import React from "react";
import { useTranslation } from "react-i18next";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import psl from "psl";
import { extractHostname } from "@catu/helpers/urls-and-domains";
import clsx from "clsx";
import ClientNumber from "../../../components/ClientNumber";

function Details({ item, loading }) {
  const { t } = useTranslation();

  if (loading)
    return (
      <>
        <div className="text-center mb-16">{t("loading")}</div>
        <LinearProgress variant="query" />
      </>
    );

  const contacts = [
    "TelBureau",
    "TelCellulaire",
    "TelFax",
    "TelDomicile",
    "TelAutre",
  ];

  const phoneNumbers = Object.keys(item || [])
    .filter((key) => !!item[key] && contacts.includes(key))
    .map((key) => {
      let icon = "local_phone";
      if (key === "TelCellulaire") icon = "phone_android";
      else if (key === "TelFax") icon = "file_copy";
      else if (key === "TelDomicile") icon = "home";
      return {
        type: key.replace("Tel", ""),
        icon,
        content: item[key],
      };
    });

  const website = {};
  if (item.SiteWeb) {
    website.domain = psl.get(extractHostname(item.SiteWeb));
    website.url = item.SiteWeb;
    if (item.SiteWeb.indexOf("http") !== 0) {
      website.url = "http://" + item.SiteWeb;
    }
  }

  return (
    <div className="flex flex-wrap">
      <div className="flex flex-wrap w-full sm:w-1/2 md:w-1/3 pr-0 sm:pr-32 self-start">
        <div className="w-full mb-16">
          <span className="text-gray-700">
            {t("dApp:client_name")}:
          </span>{" "}
          <div className="font-bold text-lg mb-6 leading-tight md:leading-normal">
            <ClientNumber
              id={item.NumeroClient}
              value={item.NomClient}
              component="span"
            />
            <Tooltip
              title={t(
                `cApp:tooltip.${item.Inactif ? "inactive" : "active"}`
              )}
            >
              <span
                className={clsx(
                  "rounded-full inline-block ml-4 w-16 h-16",
                  {
                    "bg-gray": item.Inactif,
                    "bg-green": !item.Inactif,
                  }
                )}
              ></span>
            </Tooltip>
          </div>
          <span className="text-gray-700">
            {t("cApp:ref")}# <ClientNumber id={item.NumeroClient} />
          </span>
        </div>
        <div className="w-full mb-16">
          <Divider />
        </div>
        <div className="w-full md:w-1/2 mb-8">
          <span className="text-gray-600">
            {t("cApp:client_type")}:
          </span>{" "}
          <span className="">{item.TypeClient}</span>{" "}
        </div>
        <div className="w-full md:w-1/2 mb-8">
          <span className="text-gray-600">{t("language")}:</span>{" "}
          <span className="">{item.Langue}</span>{" "}
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
            {item.Adresse},
            <br />
            {item.Ville}, {item.CodePostal}, Canada
          </span>
        </div>
        {item.Commentaires && (
          <div className="w-full mb-16">
            <span className="text-gray-600">{t("comment")}:</span>{" "}
            <p>{item.Commentaires}</p>
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
          {item.Courriel && (
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
                    <a href={`mailto:${item.Courriel}`}>
                      {item.Courriel}
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
export default Details;
