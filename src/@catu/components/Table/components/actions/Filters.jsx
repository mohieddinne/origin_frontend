import React from "react";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import { useTranslation } from "react-i18next";

function FilterHandler({ Component, options }) {
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
          <FilterListIcon />
        </Button>
      </Tooltip>
      {anchorEl && (
        <Component anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      )}
    </div>
  );
}

export default FilterHandler;
