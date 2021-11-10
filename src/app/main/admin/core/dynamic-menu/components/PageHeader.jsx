import React from "react";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function PageHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-between p-24">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Icon className="text-18" color="action">
            build
          </Icon>
          <Icon className="text-16" color="action">
            chevron_right
          </Icon>
          <Typography
            component={Link}
            role="button"
            to="/admin"
            color="textSecondary"
          >
            {t("administration")}
          </Typography>
          <Typography
            color="textSecondary"
            style={{
              margin: "0px 5px",
            }}
          >
            /
          </Typography>
          <Typography color="textSecondary">
            <strong>{t("dynmnu:dynamic_menu_management")}</strong>
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
