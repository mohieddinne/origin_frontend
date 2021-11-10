import React from "react";
import Button from "@material-ui/core/Button";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import Tooltip from "@material-ui/core/Tooltip";
import { useTranslation } from "react-i18next";
import RowFiltre from "./RowFiltre";
function AdvancedFilters(props) {
  const { Component, options } = props;
  if (!Component) return null;
  if (options.special_filter === true) return <Component />;
  return <Filter Component={Component} />;
}

function Filter({ Component }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <Tooltip title={t("filter_the_table")}>
        <Button
          aria-label={t("filter_the_table")}
          onClick={handleClick}
        >
          <MenuOpenIcon />
        </Button>
      </Tooltip>
      <RowFiltre />
    </div>
  );
}

export default AdvancedFilters;
