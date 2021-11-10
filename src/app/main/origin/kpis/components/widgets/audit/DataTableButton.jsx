import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { slugify } from "@catu/helpers/urls-and-domains";

function DataTableButton({ index, widgetName = "" }) {
  const { t } = useTranslation();
  const math = useSelector(({ kpisApp }) => kpisApp.math[index]);

  if (index === undefined || !widgetName) return "";

  const widget = slugify(widgetName);
  const url = `/app/kpis/data-table/${widget}/${math}`;

  return (
    <Button
      size="small"
      component={Link}
      to={url}
      variant="contained"
      disableElevation
      className="mr-4"
    >
      {t("kpisApp:verify_data")}
    </Button>
  );
}

export default DataTableButton;
