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
import ListItemText from "@material-ui/core/ListItemText";
import clsx from "clsx";
import * as Actions from "../../../store/actions";
import * as clientSvcs from "app/services/originServices/clientService";
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
  const filters = useSelector(({ clientApp }) => clientApp.filters);
  const filtersData = useSelector(
    ({ clientApp }) => clientApp.filtersData
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
          <InputLabel id="customers-groups-filter">
            {t("customers.group")}
          </InputLabel>
          <Select
            fullWidth
            id="customers-groups-filter"
            value={getValueFA(filters.groupId) || []}
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
            onChange={handleChange}
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
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="demo-controlled-open-select-label">
            {t("TypeClient")}
          </InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={getValueFA(filters.TypeClient) || []}
            onChange={handleChange}
            label="TypeClient"
            name="TypeClient"
            disabled={loading}
            multiple
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            {(filtersData.TypeClient || []).map(
              ({ name, value }, key) => (
                <MenuItem value={value} key={key}>
                  {value}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </MenuItem>
      <MenuItem>
        <FormControl className="w-full">
          <InputLabel id="customers-groups-filter">
            {t("status")}
          </InputLabel>
          <Select
            fullWidth
            id="customers-groups-filter"
            value={getValueFA(filters.Inactif) || []}
            onChange={handleChange}
            label="Inactif"
            name="Inactif"
            multiple
            disabled={loading}
          >
            <MenuItem value="">{t("no_filter")}</MenuItem>
            <MenuItem value="1">{t("user.active")}</MenuItem>
            <MenuItem value="0">{t("user.inactive")}</MenuItem>
          </Select>
        </FormControl>
      </MenuItem>
    </Menu>
  );
}
export default SimpleFilterMenu;
