import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  handleFilters,
  getWidgetsDatafor_excel,
} from "app/services/originServices/kpis.service";
import { saveFile, b64toBlob } from "@catu/helpers/save-blob";
import { useTranslation } from "react-i18next";

function ExcelPrint({ index, widgetName = "" }) {
  const { t } = useTranslation();

  const reduxFilters = useSelector(
    ({ kpisApp }) => kpisApp.filters[index]
  );
  const math = useSelector(({ kpisApp }) => kpisApp.math[index]);
  const [loading, setLoading] = useState(false);

  const filters = handleFilters(reduxFilters);
  const data = { filters, math, widget: widgetName };

  useEffect(() => {
    setLoading(false);
  }, [reduxFilters]);

  const generateExel = () => {
    setLoading(true);
    getWidgetsDatafor_excel(data)
      .then(({ data }) => {
        handleFile(data.kpi_xls);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFile = (rawFile) => {
    if (!rawFile) return false;
    const blob = b64toBlob(rawFile, "text/xls");
    // TODO widget name and lang

    const fileName =
      t(`kpisApp:${math + "Filename"}.${widgetName}`) + ".xlsx";
    saveFile(blob, fileName);
  };

  const handleClick = () => {
    if (loading) return false;
    generateExel();
  };

  return (
    <Button
      size="small"
      onClick={handleClick}
      variant="contained"
      disableElevation
      className="mr-4"
    >
      {loading && <CircularProgress className="mx-4" size={15} />}
      {/* <span className="hidden sm:inline-flex lg:hidden">Excel</span>
      <span className="inline-flex sm:hidden lg:inline-flex">
        {t("export_in_type", { type: "Excel" })}
      </span> */}
      <span className="inline-flex">{"Excel"}</span>
    </Button>
  );
}

export default ExcelPrint;
