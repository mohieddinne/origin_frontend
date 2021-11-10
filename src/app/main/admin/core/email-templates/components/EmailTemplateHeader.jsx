import React from "react";
import { useTranslation } from "react-i18next";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  card: {
    background: "#fafafa",
    border: "1px solid #e2e2e2",
  },
}));

function ContentCard({ data }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "flex flex-wrap m-12 rounded-8 p-16",
        classes.card
      )}
    >
      <div className="flex flex-wrap w-full sm:w-1/2 md:w-1/3 pr-0 sm:pr-32 self-start">
        <div className="w-full mb-8">
          <div className="font-bold text-lg mb-6 leading-tight md:leading-normal text-gray-700">
            {data.name}
          </div>
        </div>
        <div className="w-full mb-16">
          <Divider />
        </div>
      </div>
      <div className="flex flex-wrap w-full">
        <div className="flex flex-wrap w-full sm:w-1/2 md:w-1/3 pr-0 sm:pr-32 self-start">
          <div className="w-full mb-8">
            <span className="text-gray-600">{t("active")}: </span>
            {data.active ? t("yes") : t("no")}
          </div>
          <div className="w-full mb-8">
            <span className="text-gray-600">
              {t("emltmp:model_category")}:{" "}
            </span>
            {data.category.name}
          </div>
          <div className="w-full mb-16">
            <span className="text-gray-600  mb-16">
              {t("emltmp:model_slug")}:{" "}
            </span>
            {data.slug}
          </div>
        </div>
        <div className="w-full sm:w-1/2 md:w-2/3 pl-0 sm:pl-8">
          <div className="text-gray-600">
            {t("emltmp:model_variables")}:
          </div>
          <div className="my-8">
            {data.variables.map((variable) => (
              <Variable key={variable.name} item={variable} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Variable({ item }) {
  const { t } = useTranslation();

  const copyToClipboard = () => {
    const textField = document.createElement("textarea");
    textField.innerText = item.name;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  return (
    <Tooltip title={t("emltmp:copy_tooltip", { name: item.name })}>
      <span
        onClick={copyToClipboard}
        className="bg-gray-500 hover:bg-gray-700 cursor-pointer px-8 py-4 inline-block mr-4 mb-4 rounded-8 text-white text-md"
      >
        {item.name}
      </span>
    </Tooltip>
  );
}

export default ContentCard;
