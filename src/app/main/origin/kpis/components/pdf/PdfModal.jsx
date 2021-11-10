import React from "react";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import Divider from "@material-ui/core/Divider";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PdfPrintOrSaveButton from "./PdfPrintOrSaveButton";

function PdfModal({ index }) {
  const { t } = useTranslation();
  const fref = React.useRef();

  // Todo, get the widgets list from the backend
  const widgets = [
    {
      name: "by_types_and_offices",
      value: "lossesAndOffices",
      checked: true,
    },
    { name: "by_offices", value: "offices", checked: true },
    { name: "by_groups", value: "customerGroups", checked: true },
    { name: "by_types", value: "foldersTypes", checked: true },
    { name: "by_clients", value: "customer", checked: true },
    {
      name: "best_customers",
      value: "bestClients",
      checked: true,
    },
    { name: "appendix", value: "appendix", checked: false },
  ];

  const preventSubmit = (event) => event.preventDefault();

  const getFormData = () => {
    if (!fref.current) return {};
    const form = fref.current;
    const data = {};
    for (let item of form.elements)
      if (item.checked !== undefined) {
        data[item.value] = item.checked;
      }
    return data;
  };

  return (
    <>
      <Typography component="h3" variant="h6" gutterBottom>
        {t("kpisApp:generate_a_pdf")}
      </Typography>
      <Typography component="p" variant="body2" gutterBottom>
        {t("kpisApp:generate_a_pdf_modal_desc")}
      </Typography>
      <form className="my-16" onSubmit={preventSubmit} ref={fref}>
        <Divider classes={{ root: "mb-8" }} />
        {widgets.map((widget, key) => (
          <FormControlLabel
            className="block pl-8"
            key={key}
            value={widget.value}
            name={widget.name}
            control={
              <Checkbox
                classes={{
                  root: "p-4",
                }}
                color="primary"
                defaultChecked={widget.checked}
              />
            }
            label={t("kpisApp:pdf_options." + widget.name)}
            labelPlacement="end"
          />
        ))}
        <Divider classes={{ root: "mt-8" }} />
      </form>
      <div className="mt-8 w-full justify-center self-center">
        <PdfPrintOrSaveButton index={index} getModal={getFormData} />
      </div>
    </>
  );
}

export default React.memo(PdfModal);
