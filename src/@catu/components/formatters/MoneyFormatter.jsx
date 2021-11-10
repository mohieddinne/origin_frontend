import React from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

function MoneyFormatter({ data, number, noWarp, className, digit }) {
  const { i18n } = useTranslation();

  const options =
    number === true
      ? {}
      : {
          style: "currency",
          currency: "CAD",
        };
  if (digit !== null || digit !== undefined) {
    options.minimumFractionDigits = digit;
  }
  const formatted = new Intl.NumberFormat(
    i18n.language,
    options
  ).format(data);
  if (noWarp) return formatted;
  return <span className={clsx(className)}>{formatted}</span>;
}

export default MoneyFormatter;
