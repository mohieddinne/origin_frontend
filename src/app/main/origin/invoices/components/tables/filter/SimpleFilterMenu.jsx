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
import Typography from "@material-ui/core/Typography";
import AmountRanger from "./AmountRanger/index";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import clsx from "clsx";
import * as Actions from "../../../store/actions";
import * as foldersSvcs from "app/services/originServices/folderServices";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import FilterTypeButton from "../../../../components/FilterTypeButton";

const useStyles = makeStyles(() => ({
  w300: {
    minWidth: "300px",
  },
}));

function SimpleFilterMenu({ anchorEl, setAnchorEl }) {
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
        .filters([
          "staff",
          "offices",
          "losses",
          "groups",
          "customers",
          "insurers",
        ])
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
          <InputLabel id="folders-status-label">
            {t("fApp:folder_status")}
          </InputLabel>
          <Select
            labelId="folders-status-label"
            id="folders-status-select"
            value={getValueFA(filters.active)}
            onChange={handleChange}
            label="active"
            name="active"
            disabled={loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            <MenuItem value="1">{t("user.active")}</MenuItem>
            <MenuItem value="0">{t("user.inactive")}</MenuItem>
          </Select>
        </FormControl>
      </MenuItem>

      <AmountRanger />

      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="filters-invoice-select">
            {t("dApp:office")}
          </InputLabel>
          <Select
            labelId="filters-invoice-select"
            id="filters-invoice-select"
            value={getValueFA(filters.offices)}
            onChange={handleChange}
            label="offices"
            name="offices"
            disabled={loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {(filtersData.offices || []).map(
              ({ name, value }, key) => (
                <MenuItem value={value} key={key}>
                  {name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </MenuItem>

      {!(filtersData.staff && filtersData.staff.length === 1) && (
        <MenuItem>
          <FormControl className="w-full">
            <InputLabel id="demo-controlled-open-select-label">
              {t("dApp:responsable")}
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              value={getValueFA(filters.staff) || []}
              onChange={handleChange}
              label="staff"
              name="staff"
              disabled={loading}
              multiple
            >
              <MenuItem value="">{t("no_filter")}</MenuItem>
              {(filtersData.staff || []).map(
                ({ name, value }, key) => (
                  <MenuItem value={value} key={key}>
                    {name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </MenuItem>
      )}

      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="customers-filter">
            {t("customer", {
              count: (filters.Responsable || 0).length,
            })}
          </InputLabel>
          <Select
            fullWidth
            id="customers-filter"
            value={getValueFA(filters.customers) || []}
            onChange={handleChange}
            label="customers"
            name="customers"
            disabled={loading}
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
      <MenuItem className="flex flex-wrap">
        <div className="w-full flex items-center">
          <Typography variant="inherit">
            {t("fApp:date_facturation")}
          </Typography>
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            label={t("kpisApp:date_start")}
            format="yyyy-MM-dd"
            className="w-1/2"
            style={{ paddingRight: "12px" }}
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
            InputAdornmentProps={{ position: "end" }}
            onChange={(date) => handleDateChange("date_start", date)}
          />

          <KeyboardDatePicker
            autoOk
            className="w-1/2"
            label={t("kpisApp:date_end")}
            format="yyyy-MM-dd"
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
