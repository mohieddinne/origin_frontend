import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@material-ui/core/Card";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import ListItemText from "@material-ui/core/ListItemText";
import * as Actions from "../store/actions";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DateFnsUtils from "@date-io/date-fns";
import FuseUtils from "@fuse/FuseUtils";
import viewFolders from "./buttons/Projects";
import StarIcon from "@material-ui/icons/Star";

function Filters({ index, indicator = false }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const loading = useSelector(({ kpisApp }) => kpisApp.loading > 0);
  const filters = useSelector(
    ({ kpisApp }) => kpisApp.filters[index]
  );

  const user = useSelector(
    ({ auth }) => auth?.user?.data?.displayName
  );

  // Sun Oct 01 2017 00:00:00 GMT+0200 (heure d’été d’Europe centrale)
  const filtersData = useSelector(
    ({ kpisApp }) => kpisApp.filtersData
  );

  const canView = FuseUtils.hasPermission({
    slug: "kpis",
    permission: "can_view",
  });

  const handleChange = (event) => {
    dispatch(
      Actions.setFilters(event.target.name, event.target.value, index)
    );
  };

  const handleDateChange = (name, value) => {
    dispatch(Actions.setFilters(name, value, index));
  };

  useEffect(() => {
    if (indicator) {
      dispatch(Actions.setFilters("Responsable", [user], index));
    }
  }, [dispatch, index, indicator, user]);

  useEffect(() => {
    dispatch(Actions.loadFilters());
  }, [dispatch]);

  return (
    <Card
      className="w-full rounded-8 shadow-none border-1  p-8"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="flex flex-wrap p-8">
          <div className="flex w-1/2 md:w-1/3 p-6">
            <OutlinedSelect
              id="filters-customers_groups"
              name="customers_groups"
              variant="outlined"
              value={filters.customers_groups || []}
              onChange={handleChange}
              renderValue={(selected) => {
                let display = "";
                if (
                  Array.isArray(selected) &&
                  selected.length > 0 &&
                  selected[0] !== ""
                ) {
                  filtersData?.groups?.forEach((el) => {
                    if (selected.includes(el.value)) {
                      if (el.favorite) {
                        display += `${el.name} *, `;
                      } else {
                        display += `${el.name}, `;
                      }
                    }
                  });
                } else {
                  display = t("no_filter");
                }
                return display;
              }}
              label={t("kpisApp:customers_groups")}
              multiple
              disabled={loading}
            >
              {(filtersData.groups || []).map(
                ({ name, value, favorite }, key) => (
                  <MenuItem value={value} key={key}>
                    <ListItemText primary={name} />
                    {favorite ? <StarIcon /> : ""}
                  </MenuItem>
                )
              )}
            </OutlinedSelect>
          </div>
          <div className="flex w-1/2 md:w-1/3 p-6">
            <OutlinedSelect
              id="filters-offices"
              name="offices"
              variant="outlined"
              value={filters.offices || []}
              onChange={handleChange}
              label={t("kpisApp:offices")}
              multiple
              disabled={loading}
            >
              {(filtersData.offices || []).map((item, key) => {
                return (
                  <MenuItem value={item.value} key={key} dense={true}>
                    {item?.name === "QC" || item?.name === "Qc"
                      ? t(`kpisApp:${item.name.toLowerCase()}`)
                      : item.name}
                  </MenuItem>
                );
              })}
            </OutlinedSelect>
          </div>
          <div className="flex w-1/2 md:w-1/3 p-6">
            <OutlinedSelect
              id="filters-types"
              name="types"
              variant="outlined"
              value={filters.types || []}
              onChange={handleChange}
              label={t("kpisApp:folders_types")}
              multiple
              disabled={loading}
            >
              {(filtersData.types || []).map((item, key) => {
                return (
                  <MenuItem value={item.value} key={key} dense={true}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </OutlinedSelect>
          </div>
          <div className="flex w-1/2 md:w-1/3 p-6">
            <OutlinedSelect
              id="filters-customers"
              name="customers"
              variant="outlined"
              value={filters.customers || []}
              onChange={handleChange}
              label={t("kpisApp:customers")}
              multiple
              disabled={loading}
            >
              {(filtersData.customers || []).map((item, key) => {
                return (
                  <MenuItem value={item.value} key={key} dense={true}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </OutlinedSelect>
          </div>

          <div className="flex w-1/2 md:w-1/3 p-6">
            <KeyboardDatePicker
              autoOk
              disabled={loading}
              variant="inline"
              inputVariant="outlined"
              label={t("kpisApp:date_start")}
              className="w-full"
              format="yyyy-MM-dd"
              value={filters.date_start || null}
              InputProps={{
                startAdornment: filters.date_start && (
                  <IconButton
                    onClick={() =>
                      handleDateChange("date_start", null)
                    }
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
              onChange={(date) =>
                handleDateChange("date_start", date)
              }
            />
          </div>
          <div className="flex w-1/2 md:w-1/3 p-6">
            <KeyboardDatePicker
              autoOk
              disabled={loading}
              variant="inline"
              className="w-full"
              inputVariant="outlined"
              label={t("kpisApp:date_end")}
              format="yyyy-MM-dd"
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
              InputAdornmentProps={{
                position: "end",
              }}
              onChange={(date) => handleDateChange("date_end", date)}
            />
          </div>
          <div className="flex w-1/2 md:w-1/3 p-6">
            <OutlinedSelect
              disabled={loading}
              id="filters-offices-select"
              name="active"
              variant="outlined"
              value={filters.active || []}
              onChange={handleChange}
              label={t("actif_folder")}
              multiple
            >
              <MenuItem value="">{t("no_filter")}</MenuItem>
              <MenuItem value="1">{t("active")}</MenuItem>
              <MenuItem value="0">{t("inactive")}</MenuItem>
            </OutlinedSelect>
          </div>
          <div className="flex w-1/2 md:w-1/3 p-6">
            <KeyboardDatePicker
              autoOk
              inputVariant="outlined"
              className="w-full"
              label={t("kpisApp:date_start_ferme")}
              format="yyyy-MM-dd"
              value={filters.date_start_ferme || null}
              InputProps={{
                startAdornment: filters.date_start_ferme && (
                  <IconButton
                    onClick={() =>
                      handleDateChange("date_start_ferme", null)
                    }
                    disabled={!filters.date_start_ferme}
                    style={{ order: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              InputAdornmentProps={{
                position: "end",
              }}
              onChange={(date) =>
                handleDateChange("date_start_ferme", date)
              }
            />
          </div>
          <div className="flex w-1/2 md:w-1/3 p-6">
            <KeyboardDatePicker
              autoOk
              inputVariant="outlined"
              label={t("kpisApp:date_end_ferme")}
              format="yyyy-MM-dd"
              className="w-full"
              value={filters.date_end_ferme || null}
              InputProps={{
                startAdornment: filters.date_end_ferme && (
                  <IconButton
                    onClick={() =>
                      handleDateChange("date_end_ferme", null)
                    }
                    disabled={!filters.date_end_ferme}
                    style={{ order: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
              }}
              InputAdornmentProps={{ position: "end" }}
              onChange={(date) =>
                handleDateChange("date_end_ferme", date)
              }
            />
          </div>
          {canView && (
            <div className="flex w-1/2 md:w-1/3 p-6">
              <OutlinedSelect
                disabled={loading}
                id="filters-Responsable"
                name="Responsable"
                variant="outlined"
                value={filters.Responsable || []}
                onChange={handleChange}
                label={t("kpisApp:Responsable")}
                multiple
              >
                {indicator ? (
                  <MenuItem value={user} dense={true}>
                    {user}
                  </MenuItem>
                ) : (
                  filtersData?.Responsable?.map((item, key) => {
                    return (
                      <MenuItem
                        className={
                          !item.actif ? "text-gray-500" : "text-black"
                        }
                        value={item.value}
                        key={key}
                        dense={true}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })
                )}
              </OutlinedSelect>
            </div>
          )}

          {indicator && (
            <div className="flex w-1/2 md:w-1/3 p-6">
              <Button
                className="w-full"
                variant="outlined"
                inputVariant="outlined"
                onClick={() => viewFolders({ history, filters })}
              >
                {t(`dashApp:button.${"see_all_my_folders"}`)}
              </Button>
            </div>
          )}
        </div>
      </MuiPickersUtilsProvider>
    </Card>
  );
}

function OutlinedSelect(props) {
  return (
    <FormControl variant="outlined" className="w-full">
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Select
        {...props}
        input={
          <OutlinedInput
            labelWidth={(props.label || "").length * 8}
            id={props.name}
            name={props.name}
          />
        }
      >
        {props.children}
      </Select>
    </FormControl>
  );
}

export default Filters;
