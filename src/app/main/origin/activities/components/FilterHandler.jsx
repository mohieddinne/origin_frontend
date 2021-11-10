import React from "react";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import { useTranslation } from "react-i18next";
import FilterStateHandler from "./FilterStateHandler";
import { useSelector } from "react-redux";

function FilterHandler() {
  const [anchorEl, setAnchorEl] = React.useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <FilterBtn handleClick={handleClick} />
      {anchorEl && (
        <FilterStateHandler
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      )}
    </div>
  );
}

function FilterBtn({ handleClick }) {
  const { t } = useTranslation();
  const filters = useSelector(({ activityApp }) => {
    const keys = Object.keys(activityApp.filters);
    let activeFilters = 0;
    for (const filter of keys) {
      const value = activityApp.filters[filter];
      //Check if the value is OK
      const isarray = Array.isArray(value);
      if (!isarray || value.length > 1) {
        if (value !== "00") {
          activeFilters++;
        }
      }
    }
    return activeFilters;

    //return Object.keys(activityApp.filters).length || 0;
  });

  return (
    <>
      <Tooltip title={t("filter_the_table")}>
        <Button
          aria-label={t("filter_the_table")}
          onClick={handleClick}
        >
          <FilterListIcon />
          {filters > 0 && (
            <div className="bg-blue-700 text-white w-20 h-20 text-xs rounded-full leading-8 ml-4 inline-block">
              {filters}
            </div>
          )}
        </Button>
      </Tooltip>
    </>
  );
}

export default FilterHandler;
