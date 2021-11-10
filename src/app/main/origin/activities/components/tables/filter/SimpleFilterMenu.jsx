import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import * as Actions from "../../../store/actions";
import * as clientSvcs from "app/services/originServices/clientService";
import FilterTypeButton from "../../../../components/FilterTypeButton";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  w300: {
    minWidth: "300px",
  },
}));

function SimpleFilterMenu({ anchorEl, setAnchorEl }, props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const filters = useSelector(
    ({ activityApp }) => activityApp.filters
  );
  const filtersData = useSelector(
    ({ activityApp }) => activityApp.filtersData
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!Object.keys(filtersData).length) {
      setLoading(true);
      clientSvcs
        .filters(["Inactif", "groups", "TypeClient"])
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
    const { name } = event.target;
    let value = event.target.value;
    if (!Array.isArray(value)) return;

    if (
      value.includes("") &&
      Array.isArray(filters[name]) &&
      filters[name].length > 0
    )
      value = [];
    else {
      value = value.filter((element) => element);
    }

    dispatch(Actions.setFilters(name, value));
  };

  const handleDateChange = (name, value) => {
    dispatch(Actions.setFilters(name, value));
  };

  const resetFilters = () => {
    dispatch(Actions.resetFilters());
  };

  const getValueFA = (a) => (Array.isArray(a) && a.length ? a : [""]);

  return (
    <Menu
      style={{ top: "65px", left: "-50px" }}
      id="simple-menu"
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
        <div>
          <FilterTypeButton
            onChange={() => {
              handleClose();
              dispatch(Actions.resetFilters());
            }}
          />
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
      </div>
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="filters-offices-select">
            {t("activities:invoice_state")}
          </InputLabel>
          <Select
            labelId="filters-offices-select"
            id="filters-offices-select"
            value={getValueFA(filters.invoice)}
            onChange={handleChange}
            label="invoice"
            name="invoice"
            disabled={props.loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            <MenuItem value="1">
              {t("activities:affected_invoice")}
            </MenuItem>
            <MenuItem value="0">
              {t("activities:unaffected_invoice")}
            </MenuItem>
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="demo-controlled-open-select-label">
            {t("dApp:responsable")}
          </InputLabel>
          <Select
            disabled={filtersData?.staff?.length < 2}
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={filters.responsible || []}
            onChange={handleChange}
            label="Responsable"
            name="responsible"
            renderValue={(selected) => {
              let display = "";
              if (
                Array.isArray(selected) &&
                selected.length > 0 &&
                selected[0] !== ""
              ) {
                filtersData?.staff?.forEach((el) => {
                  if (selected.includes(el.value))
                    display += `${el.value}, `;
                });
              } else {
                display = t("no_filter");
              }
              return display;
            }}
            multiple
          >
            {filtersData?.staff?.map(({ value, active, id }, key) => {
              return (
                <MenuItem
                  value={value}
                  key={key}
                  className={!active ? "text-gray-500" : "text-black"}
                >
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </MenuItem>

      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="customers-filter">
            {t("customer")}
          </InputLabel>
          <Select
            fullWidth
            id="customers-filter"
            value={getValueFA(filters.customers) || []}
            onChange={handleChange}
            label="customers"
            name="customers"
            disabled={props.loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {(filtersData.customers || []).map(
              ({ name, value }, key) => (
                <MenuItem value={value} key={key}>
                  {name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="categories-filter">
            {t("activities:category")}
          </InputLabel>
          <Select
            fullWidth
            id="categories-filter"
            value={getValueFA(filters.categories) || []}
            onChange={handleChange}
            label="categories"
            name="categories"
            disabled={props.loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {(filtersData.categories || []).map(
              ({ name, value }, key) => (
                <MenuItem value={value} key={key}>
                  {name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="activities-filter">
            {t("activities:activity")}
          </InputLabel>
          <Select
            fullWidth
            id="activities-filter"
            value={getValueFA(filters.activities) || []}
            onChange={handleChange}
            label="activities"
            name="activities"
            disabled={props.loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {(filtersData.activities || []).map(
              ({ name, value }, key) => (
                <MenuItem value={value} key={key}>
                  {name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="insurers-filter">
            {t("activities:insurer")}
          </InputLabel>
          <Select
            fullWidth
            id="insurers-filter"
            value={getValueFA(filters.insurers) || []}
            onChange={handleChange}
            label="insurers"
            name="insurers"
            disabled={props.loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {(filtersData.insurers || []).map(
              ({ name, value }, key) => (
                <MenuItem value={name} key={key}>
                  {name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem className="flex flex-wrap">
        <div className="w-full flex items-center">
          <Typography variant="inherit">
            {t("activities:activity_date")}
          </Typography>
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            className="w-1/2"
            style={{ paddingRight: "12px" }}
            label={t("activities:date_activity_start")}
            format="yyyy-MM-dd"
            value={filters.date_start || null}
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
            InputAdornmentProps={{
              position: "end",
            }}
            onChange={(date) => handleDateChange("date_start", date)}
          />

          <KeyboardDatePicker
            autoOk
            label={t("activities:date_activity_end")}
            format="yyyy-MM-dd"
            className="w-1/2"
            value={filters.date_end || null}
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
}
export default SimpleFilterMenu;
