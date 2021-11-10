import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { getDefaultDates } from "@catu/helpers/dates.helpers";

function MyInvoicesButton() {
  const history = useHistory();
  const { t } = useTranslation();
  const defaultDates = getDefaultDates();

  const user = useSelector(({ auth }) => {
    if (auth.user.data) return auth.user.data.NomEmploye;
    else return null;
  });

  const handleClick = () => {
    const context = {
      Responsable: [user],
      date_start: defaultDates[0],
      date_end: defaultDates[1],
    };
    let new_date = null;
    if (new_date) {
      context.date_start = new Date(new_date);
      context.date_end = new Date();
    }
    history.push("/app/invoices/list", context);
  };

  return (
    <Button size="small" onClick={handleClick}>
      {t("dashApp:button.see_all_my_bills")}
    </Button>
  );
}

export default MyInvoicesButton;
