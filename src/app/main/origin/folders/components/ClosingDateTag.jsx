import React from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

function ClosingDateTag({ date }) {
  const { t, i18n } = useTranslation();
  const intl = new Intl.DateTimeFormat(i18n.language);

  let string = t("dApp:folder_Actif");
  if (date) string = `${t("dApp:closed_on")} ${intl.format(date)}`;

  return (
    <span
      className={clsx(
        "text-white text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap mx-4",
        {
          "bg-blue": !!date,
          "bg-green": !date,
        }
      )}
    >
      {string}
    </span>
  );
}

export default ClosingDateTag;
