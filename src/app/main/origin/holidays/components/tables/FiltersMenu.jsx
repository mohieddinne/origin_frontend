import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import clsx from "clsx";
import * as Actions from "../../store/action";

const useStyles = makeStyles(() => ({
  w300: {
    minWidth: "300px",
  },
}));

const Filter = ({ anchorEl, setAnchorEl }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const filters = useSelector(({ HolidaysApp }) => {
    return HolidaysApp.filters || {};
  });
  const [loading] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value || null;
    dispatch(Actions.setFilter(name, value));
  };

  const resetFilters = () => dispatch(Actions.resetFilters());

  const max = new Date().getFullYear();
  const min = 2019;
  const years = [];
  for (let i = max; i >= min; i--) years.push(i);

  return (
    <Menu
      style={{ top: "65px", left: "-50px" }}
      id="holidays-filter-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <div
        className={clsx(
          classes.w300,
          "mx-20 mt-8 mb-12 text-grey flex justify-between items-center"
        )}
      >
        <span>{t("filter_by")}</span>
        <Button
          onClick={resetFilters}
          variant="contained"
          size="small"
          disabled={loading}
          disableElevation
          className="ml-8"
        >
          {t("reset_filters")}
        </Button>
      </div>

      <MenuItem className="flex flex-wrap">
        <FormControl className="w-full">
          <InputLabel id="filters-year-select">
            {t("calendar.year")}
          </InputLabel>
          <Select
            labelId="filters-year-select"
            id="filters-year-select"
            value={filters.year || ""}
            onChange={handleChange}
            label="year"
            name="year"
            disabled={loading}
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {years.map((year) => (
              <MenuItem value={year} key={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </MenuItem>
    </Menu>
  );
};
export default Filter;
