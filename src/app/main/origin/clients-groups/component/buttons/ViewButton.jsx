import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import slugify from "slugify";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";

function ViewButton({ item, history }) {
  const { t } = useTranslation();

  const handleEditClick = () => {
    const slug = slugify(item.name || "").toLocaleLowerCase();
    history.push(`/app/clients/groups/item/${item.id}-${slug}`);
    return true;
  };

  return (
    <Tooltip title={t("button.edit")}>
      <IconButton onClick={handleEditClick}>
        <Icon>edit</Icon>
      </IconButton>
    </Tooltip>
  );
}

export default withRouter(ViewButton);
