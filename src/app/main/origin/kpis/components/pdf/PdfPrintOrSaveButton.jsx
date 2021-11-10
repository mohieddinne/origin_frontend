import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Icon from "@material-ui/core/Icon";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  handleFilters,
  getpdf,
} from "app/services/originServices/kpis.service";
import { saveFile, b64toBlob } from "@catu/helpers/save-blob";
import moment from "moment";
import { useTranslation } from "react-i18next";

function PdfPrintOrSaveButton({ index, getModal }) {
  const { t } = useTranslation();
  const moduleLoading = useSelector(
    ({ kpisApp }) => kpisApp.loading > 0
  );
  const filters = useSelector(
    ({ kpisApp }) => kpisApp.filters[index]
  );
  const math = useSelector(({ kpisApp }) => kpisApp.math[index]);

  const _filters = handleFilters(filters);
  const data = { filters: _filters, math };
  const [loading, setLoading] = useState([false, false]);

  useEffect(() => {
    setLoading([false, false]);
  }, [filters]);

  const generatePDF = (print = false) => {
    setLoading([Boolean(print), !Boolean(print)]);
    // Handle form data
    let pdfOptions = {};
    if (typeof getModal === "function") {
      pdfOptions = getModal();
    }
    getpdf(data, pdfOptions)
      .then((response) => {
        handleFile(print, response.data.kpi_pdf);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      })
      .finally(() => {
        setLoading([false, false]);
      });
  };

  const handleFile = (print, rawFile) => {
    if (!rawFile) return false;
    const blob = b64toBlob(rawFile);
    if (print) {
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } else {
      const fileName =
        moment().format("YYYY-MM-DD") + " Rapport Origin.pdf";
      saveFile(blob, fileName);
    }
  };

  const handleClick = ({ print }) => {
    if (loading[0] || loading[1]) return false;
    generatePDF(print);
  };

  return (
    <ButtonGroup size="large" className="h-32 w-full">
      {["print", "get_app"].map((icon, key) => (
        <Button
          key={key}
          variant="outlined"
          onClick={() => handleClick({ print: icon === "print" })}
          disabled={loading[0] || loading[1] || moduleLoading}
          classes={{
            root: "w-1/2 sm:w-auto px-16",
          }}
        >
          <StartIcon loading={loading[key]} base={icon} />
          <span className="hidden sm:inline-block sm:ml-12 sm:mr-4">
            {t("kpisApp:pdf_actions." + icon)}
          </span>
        </Button>
      ))}
    </ButtonGroup>
  );
}

function StartIconComp({ loading, base }) {
  if (loading) return <CircularProgress className="mx-4" size={15} />;
  return <Icon fontSize="small" children={base} />;
}
const StartIcon = React.memo(StartIconComp);

export default PdfPrintOrSaveButton;
