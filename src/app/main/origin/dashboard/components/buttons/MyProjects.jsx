import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
// import { getDefaultDates } from "@catu/helpers/dates.helpers";
// const defaultDates = getDefaultDates();

function MyProjectsButton({ period, employee, active }) {
  const history = useHistory();
  const { t } = useTranslation();
  const params = useParams();

  const user = useSelector(({ auth }) => {
    if (auth.user.data) return auth.user.data.NomEmploye;
    else return null;
  });

  const handleClick = () => {
    const filters = {
      Responsable: [employee ? employee : user],
    };

    const today = new Date();
    let new_date = null;
    if (period) {
      switch (period) {
        case "week":
          new_date = new Date(today.setDate(today.getDate() - 7));
          break;
        case "quarter":
          new_date = new Date(today.setMonth(today.getMonth() - 3));
          break;
        case "month":
          new_date = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case "year":
          new_date = new Date(
            today.setFullYear(today.getFullYear() - 1)
          );
          break;
        default:
          break;
      }
      filters.date_start = new_date;
      filters.date_end = new Date();
    }

    if (active) {
      filters.active = ["1"];
    }
    const folderBeginWith00 = "00";
    filters.default_filter = folderBeginWith00;
    // Send the data
    history.push("/app/folders/list", {
      filters,
      title: employee
        ? "kpisApp:tabs.dashboard"
        : "dashApp:dashboard",
    });
  };

  return (
    <Button variant="outlined" disableElevation onClick={handleClick}>
      {t(
        params?.tab === "dashboard"
          ? `dashApp:button.see_all_folders`
          : `dashApp:button.see_all_folders`
      )}
    </Button>
  );
}

export default MyProjectsButton;
