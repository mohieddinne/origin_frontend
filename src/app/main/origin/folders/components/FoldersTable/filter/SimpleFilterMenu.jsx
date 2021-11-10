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
import ListItemText from "@material-ui/core/ListItemText";
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
import StarIcon from "@material-ui/icons/Star";
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
  const filters = useSelector(({ folderApp }) => folderApp.filters);
  const filtersData = useSelector(
    ({ folderApp }) => folderApp.filtersData
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

    dispatch(Actions.setFilter(name, value));
  };

  const handleDateChange = (name, value) => {
    dispatch(Actions.setFilter(name, value));
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
            {t("status_dossier")}
          </InputLabel>
          <Select
            labelId="filters-offices-select"
            id="filters-offices-select"
            value={getValueFA(filters.active)}
            onChange={handleChange}
            label="active"
            name="active"
            disabled={loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            <MenuItem value="1">{t("active")}</MenuItem>
            <MenuItem value="0">{t("inactive")}</MenuItem>
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="filters-offices-select">
            {t("dApp:office")}
          </InputLabel>
          <Select
            labelId="filters-offices-select"
            id="filters-offices-select"
            value={getValueFA(filters.Bureau)}
            onChange={handleChange}
            label="Bureau"
            name="Bureau"
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
              value={getValueFA(filters.Responsable) || []}
              onChange={handleChange}
              label="Responsable"
              name="Responsable"
              disabled={
                loading || (filtersData.staff || []).length === 1
              }
              multiple
            >
              <MenuItem value="">{t("no_filter")}</MenuItem>
              {Array.isArray(filtersData.staff) &&
                filtersData.staff.length > 0 &&
                filtersData.staff.map((item, key) => {
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
                })}
            </Select>
          </FormControl>
        </MenuItem>
      )}
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="demo-controlled-open-select-label">
            {t("dApp:TypeDePerte")}
          </InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={getValueFA(filters.TypeDePerte) || []}
            onChange={handleChange}
            label="TypeDePerte"
            name="TypeDePerte"
            disabled={loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {(filtersData.losses || []).map(
              ({ name, value }, key) => (
                <MenuItem value={value} key={key}>
                  {name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </MenuItem>
      <div className="flex nowrap w-full">
        <MenuItem className=" w-full">
          <FormControl className=" w-full">
            <InputLabel id="customers-groups-filter">
              {t("customers.group")}
            </InputLabel>
            <Select
              fullWidth
              id="customers-groups-filter"
              value={getValueFA(filters.groupId) || []}
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
              label="groupId"
              name="groupId"
              disabled={loading}
              multiple
            >
              <MenuItem value="">{t("no_filter")}</MenuItem>
              {(filtersData.groups || []).map(
                ({ name, value, favorite }, key) => (
                  <MenuItem value={value} key={key}>
                    <ListItemText primary={name} />
                    {favorite ? <StarIcon /> : ""}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem className=" w-full pl-0">
          <FormControl className="w-full">
            <InputLabel id="insurer-groups-filter">
              {t("insurers.group")}
            </InputLabel>
            <Select
              fullWidth
              id="insurer-groups-filter"
              value={getValueFA(filters.insurerId) || []}
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
              label="insurerGroupId"
              name="insurerId"
              disabled={loading}
              multiple
            >
              <MenuItem value="">{t("no_filter")}</MenuItem>
              {(filtersData.groups || []).map(
                ({ name, value, favorite }, key) => (
                  <MenuItem value={value} key={key}>
                    <ListItemText primary={name} />
                    {favorite ? <StarIcon /> : ""}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </MenuItem>
      </div>
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
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="insurers-filter">
            {t("insurer", {
              count: (filters.Responsable || 0).length,
            })}
          </InputLabel>
          <Select
            fullWidth
            id="insurers-filter"
            value={getValueFA(filters.insurers) || []}
            onChange={handleChange}
            label="insurers"
            name="insurers"
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
            {t("dApp:mandate_date")}
          </Typography>
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            className="w-1/2"
            style={{ paddingRight: "12px" }}
            label={t("dApp:date_start")}
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
            label={t("dApp:date_end")}
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
      <MenuItem className="flex flex-wrap">
        <div className="w-full flex items-center">
          <Typography variant="inherit">
            {t("dApp:date_ferme")}
          </Typography>
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            className="w-1/2"
            style={{ paddingRight: "12px" }}
            label={t("dApp:date_start_ferme")}
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

          <KeyboardDatePicker
            autoOk
            label={t("dApp:date_end_ferme")}
            format="yyyy-MM-dd"
            className="w-1/2"
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
        </MuiPickersUtilsProvider>
      </MenuItem>

      {/**MandatDate filter */}
      <MenuItem className="flex flex-wrap">
        <div className="w-full flex items-center">
          <Typography variant="inherit">
            {t("dApp:date_perte")}
          </Typography>
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            className="w-1/2"
            style={{ paddingRight: "12px" }}
            label={t("dApp:date_start")}
            format="yyyy-MM-dd"
            value={filters.date_start_loss || null}
            InputProps={{
              startAdornment: filters.date_start_loss && (
                <IconButton
                  onClick={() =>
                    handleDateChange("date_start_loss", null)
                  }
                  disabled={!filters.date_start_loss}
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
              handleDateChange("date_start_loss", date)
            }
          />
          <KeyboardDatePicker
            autoOk
            label={t("dApp:date_end")}
            format="yyyy-MM-dd"
            className="w-1/2"
            value={filters.date_end_loss || null}
            InputProps={{
              startAdornment: filters.date_end_loss && (
                <IconButton
                  onClick={() =>
                    handleDateChange("date_end_loss", null)
                  }
                  disabled={!filters.date_end_loss}
                  style={{ order: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              ),
            }}
            InputAdornmentProps={{ position: "end" }}
            onChange={(date) =>
              handleDateChange("date_end_loss", date)
            }
          />
        </MuiPickersUtilsProvider>
      </MenuItem>
    </Menu>
  );
}
export default SimpleFilterMenu;
