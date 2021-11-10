import React from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

function PercentFormatter({ data, noWarp, className, digits }) {
  const { i18n } = useTranslation();
  const options = {
    style: "percent",
    maximumFractionDigits: digits || 2,
  };
  const formatted = new Intl.NumberFormat(
    i18n.language,
    options
  ).format(data);
  if (noWarp) return formatted;
  return <span className={clsx(className)}>{formatted}</span>;
}

export default PercentFormatter;
