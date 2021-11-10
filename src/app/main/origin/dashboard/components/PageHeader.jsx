import React from "react";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

function PageHeader() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 items-center justify-between p-24">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Icon className="text-18" color="action">
            dashboard
          </Icon>
          <Icon className="text-16" color="action">
            chevron_right
          </Icon>
          <Typography color="textSecondary">
            {t("dashboard")}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
