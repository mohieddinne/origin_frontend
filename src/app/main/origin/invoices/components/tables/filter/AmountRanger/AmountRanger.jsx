import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Slider from "@material-ui/core/Slider";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import { useTranslation } from "react-i18next";
import * as Actions from "../../../../store/actions";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import { makeStyles } from "@material-ui/styles";

const useStyle = makeStyles(() => ({
  markLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "1.4rem",
  },
}));

let timeout;

function ReduxHandler(props) {
  const filter = useSelector(({ factureApp }) => {
    if (Array.isArray(factureApp.filters.amount)) {
      const [a, b] = factureApp.filters.amount;
      return [parseInt(a), parseInt(b)];
    } else {
      return [props.min, props.max];
    }
  });

  return <AmountRanger {...props} defaultValue={filter} />;
}

function AmountRanger({ min, max, disabled, defaultValue }) {
  const classes = useStyle();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e, value) => {
    setValue(value);
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      if (value[0] === min && value[1] === max) {
        dispatch(Actions.setFilters("amount", null));
      } else {
        dispatch(
          Actions.setFilters("amount", [`${value[0]}`, `${value[1]}`])
        );
      }
    }, 500);
  };

  const marks = [
    {
      value: min,
    },
    {
      value: 0,
    },
    {
      value: max,
    },
  ];

  return (
    <MenuItem>
      <FormControl className="w-full">
        <Typography id="range-slider">
          {t("MontantFacture")}
        </Typography>
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          name="amount"
          aria-labelledby="range-slider"
          disabled={disabled}
          marks={marks}
          max={max}
          min={min}
        />
        <div className="flex justify-between">
          <div className={classes.markLabel}>
            <MoneyFormatter data={min} noWarp={true} digit={0} />
          </div>
          <div>
            <MoneyFormatter
              data={value[0]}
              number={true}
              noWarp={true}
              digit={0}
            />
            {" - "}
            <MoneyFormatter
              data={value[1]}
              number={true}
              noWarp={true}
              digit={0}
            />
          </div>
          <div className={classes.markLabel}>
            <MoneyFormatter data={max} noWarp={true} digit={0} />
          </div>
        </div>
      </FormControl>
    </MenuItem>
  );
}

export default ReduxHandler;
