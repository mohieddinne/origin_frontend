import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import clsx from "clsx";
import * as Actions from "../store/actions";
import * as foldersSvcs from "app/services/originServices/folderServices";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
  w300: {
    minWidth: "300px",
  },
}));

const Filter = ({ anchorEl, setAnchorEl }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const filters = useSelector(({ factureApp }) => factureApp.filters);
  const filtersData = useSelector(
    ({ factureApp }) => factureApp.filtersData
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!Object.keys(filtersData).length) {
      setLoading(true);
      foldersSvcs
        .filters(["staff"])
        .then((response) => {
          const data = {};
          for (const item of response) {
            data[item.name] = item.data;
          }
          dispatch(Actions.loadFilters(data));
          setLoading(false);
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production")
            console.error(error);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch(Actions.setFilters(name, value));
  };

  const handleDateChange = (name, value) => {
    dispatch(Actions.setFilters(name, value));
  };

  return (
    <Menu
      style={{ top: "65px", left: "-50px" }}
      id="filter-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <div
        className={clsx(classes.w300, "mx-20 mt-8 mb-12 text-grey")}
      >
        {t("filter_by")}
      </div>
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="staff-filter">
            {t("dApp:responsable")}
          </InputLabel>
          <Select
            labelId="staff-filter"
            id="staff-filter"
            value={filters.Responsable || ""}
            onChange={handleChange}
            label="Responsable"
            name="Responsable"
            disabled={loading}
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {(filtersData.staff || []).map(({ name, value }, key) => (
              <MenuItem value={value} key={key}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            label={t("kpisApp:date_start")}
            format="dd/MM/yyyy"
            name="date_start"
            style={{ paddingRight: "12px" }}
            value={filters.date_start}
            InputProps={{
              startAdornment: filters.date_start && (
                <IconButton
                  onClick={() => handleDateChange("date_start", null)}
                  disabled={!filters.date_start}
                  style={{ order: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              ),
            }}
            InputAdornmentProps={{ position: "end" }}
            onChange={(date) => handleDateChange("date_start", date)}
          />
          <KeyboardDatePicker
            autoOk
            label={t("kpisApp:date_end")}
            format="dd/MM/yyyy"
            name="date_end"
            value={filters.date_end}
            InputProps={{
              startAdornment: filters.date_end && (
                <IconButton
                  onClick={() => handleDateChange("date_end", null)}
                  disabled={!filters.date_end}
                  style={{ order: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              ),
            }}
            InputAdornmentProps={{ position: "end" }}
            onChange={(date) => handleDateChange("date_end", date)}
          />
        </MuiPickersUtilsProvider>
      </MenuItem>
    </Menu>
  );
};
export default Filter;
