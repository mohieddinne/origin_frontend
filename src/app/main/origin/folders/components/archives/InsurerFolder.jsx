import React from "react";
import Icon from "@material-ui/core/Icon";
import { useTranslation } from "react-i18next";

function InsurerFromFolder({ data }) {
  const { t } = useTranslation();

  const allowedKeys = [
    "TelBureauContactAssure",
    "TelFaxContactAssure",
    "TelCellulaireContactAssure",
    "TelDomicileContactAssure",
    "TelAutreContactAssure",
  ];

  const phoneNumbers = allowedKeys
    .filter((item) => !!data[item])
    .map((item) => {
      let icon = "local_phone";
      let type = "Autre";
      if (item === "TelCellulaireContactAssure") {
        icon = "phone_android";
        type = "Cellulaire";
      } else if (item === "TelFaxContactAssure") {
        icon = "file_copy";
        type = "Fax ";
      } else if (item === "TelBureauContactAssure") {
        icon = "home";
        type = "Bureau";
      }
      const content = data[item].split("(")[0];
      let disponible = data[item].split("(")[1];
      disponible
        ? (disponible = disponible.replace(")", ""))
        : (disponible = null);

      return {
        type,
        icon,
        disponible,
        content,
      };
    });

  return (
    <div className="flex flex-wrap flex-col w-full sm:w-1/2 md:w-1/3 pl-0 sm:pl-8 self-start">
      <div className="flex flex-wrap flex-row w-full">
        <div className="w-full mb-16">
          <h6 className="font-bold text-lg mb-6 leading-tight md:leading-normal">
            {t("dApp:insurer")}:
          </h6>
        </div>
        <div className="w-full mb-8">
          <span className="text-gray-500">
            {t("dApp:name_insurer")}:{" "}
          </span>
          {data.NomAssure}
          {data.TypeAssure && (
            <span className="text-white text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap bg-blue mx-4">
              {data.TypeAssure}
            </span>
          )}
        </div>
        {data.PersonneContactAssure && (
          <div className="w-full mb-8">
            <span className="text-gray-500">
              {t("dApp:PersonneContactAssure")}:{" "}
            </span>
            {data.PersonneContactAssure}
          </div>
        )}
        <div className="w-full mb-8">
          <div className="text-gray-500 mb-1">
            {t("dApp:address_insurer")}:{" "}
          </div>
          <address className="not-italic">
            {data.AdresseAssure}
            {data.VilleAssure && `, ${data.VilleAssure}`}
            {data.CodePostalAssure && `, ${data.VilleAssure}`}
            {(data.AdresseAssure ||
              data.VilleAssure ||
              data.CodePostalAssure) &&
              `, Canada`}

            {!data.AdresseAssure &&
              !data.VilleAssure &&
              !data.CodePostalAssure &&
              t("no_.address")}
          </address>
        </div>
      </div>

      {data.CommentaireContactAssure && (
        <div className="w-full mb-8">
          <div className="text-gray-500 mb-1">
            {t("dApp:insurer_comments") + ": "}
          </div>
          {data.CommentaireContactAssure}
        </div>
      )}

      <div className="w-full flex flex-wrap">
        {phoneNumbers.map((item, key) => (
          <div
            className="mb-8 w-full sm:w-1/2 pr-8 last:pr-0"
            key={key}
          >
            <div className="p-8 bg-gray-100 w-full flex items-center rounded">
              <Icon
                fontSize="large"
                className="text-gray-500 ml-2 mr-12"
              >
                {data.icon}
              </Icon>
              <div>
                <span className="text-gray-500 text-xs">
                  {data.type}
                  {data.disponible && ` (${data.disponible})`}
                  {": "}
                </span>
                <div className="font-bold">
                  <a href={`tel:${data.content.replace(" ", "")}`}>
                    {data.content}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.CourrielContactAssure && (
          <div className="mb-8 w-full sm:w-1/2 pr-8 last:pr-0">
            <div className="p-8 bg-gray-100 w-full flex items-center rounded">
              <Icon
                fontSize="large"
                className="text-gray-500 ml-2 mr-12"
              >
                alternate_email
              </Icon>
              <div>
                <span className="text-gray-500 text-xs">
                  {t("dApp:email")}:
                </span>{" "}
                <div className="font-bold truncate">
                  <a href={`mailto:${data.CourrielContactAssure}`}>
                    {data.CourrielContactAssure}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsurerFromFolder;
