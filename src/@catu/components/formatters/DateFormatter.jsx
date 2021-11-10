import React from "react";
import { useTranslation } from "react-i18next";

function DateFormatter({ date, time, className }) {
  const { i18n, t } = useTranslation();
  let dateFormatted;
  if (isValidDate(date)) {
    dateFormatted = new Date(date);
  } else if (parseInt(date)) {
    dateFormatted = new Date(parseInt(date));
  } else {
    return (
      <span className="text-grey italic">{t("calendar.none")}</span>
    );
  }
  const options = {};
  if (time === true) {
    options.year = "numeric";
    options.month = "numeric";
    options.day = "numeric";
    options.hour = "numeric";
    options.minute = "numeric";
    options.second = "numeric";
    options.timeZone = "Europe/Helsinki";
  }
  const d = new Intl.DateTimeFormat(i18n.language, options).format(
    dateFormatted
  );
  return <span className={className}>{d}</span>;
}

function isValidDate(dateObject) {
  if (!dateObject) return false;
  return new Date(dateObject).toString() !== "Invalid Date";
}

export default React.memo(DateFormatter);
