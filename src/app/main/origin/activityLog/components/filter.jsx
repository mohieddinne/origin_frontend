import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import clsx from "clsx";
import * as Actions from "../store/action";

const useStyles = makeStyles(() => ({
  w300: {
    minWidth: "300px",
  },
}));

const Filter = ({ anchorEl, setAnchorEl }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const filters = useSelector(
    ({ Activity_log_app }) => Activity_log_app.filters
  );

  const [loading] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (name, value) => {
    dispatch(Actions.setFilter(name, value));
  };

  const resetFilters = () => {
    dispatch(Actions.resetFilters());
  };

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
        <div className="w-full flex items-center">
          <Typography variant="inherit">
            {t("activity_log:activity_log_date")}
          </Typography>
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            className="w-full flex"
            label={t("activity_log:date")}
            format="yyyy-MM-dd"
            value={filters.activity_date || null}
            InputProps={{
              startAdornment: filters.activity_date && (
                <IconButton
                  onClick={() =>
                    handleDateChange("activity_date", null)
                  }
                  disabled={!filters.activity_date}
                  style={{ order: 1 }}
                >
                  <CloseIcon />
                </IconButton>
              ),
            }}
            InputAdornmentProps={{ position: "end" }}
            onChange={(date) =>
              handleDateChange("activity_date", date)
            }
          />
        </MuiPickersUtilsProvider>
      </MenuItem>
    </Menu>
  );
};
export default Filter;
