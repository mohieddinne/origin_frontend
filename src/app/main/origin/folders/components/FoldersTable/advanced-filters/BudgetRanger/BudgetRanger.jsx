import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import { useTranslation } from "react-i18next";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import { makeStyles } from "@material-ui/styles";
import { useQuery, gql } from "@apollo/client";
import { withFormsy } from "formsy-react";

const query = gql`
  query {
    filters(slugs: "Budget") {
      name
      data {
        name
        value
      }
    }
  }
`;

const useStyle = makeStyles(() => ({
  markLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "1.4rem",
  },
}));

function BudgetRanger(props) {
  const classes = useStyle();
  const { t } = useTranslation();

  const { errorMessage, value, setValue } = props;

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [_value, _setValue] = useState([0, 100]);
  const { data, loading, error } = useQuery(query);

  useEffect(() => {
    if (Array.isArray(data?.filters) && data.filters[0]?.data) {
      const range = data.filters[0].data;
      const min =
        parseInt(range.find((item) => item.name === "min").value) ||
        0;
      const max =
        parseInt(range.find((item) => item.name === "max").value) ||
        0;
      setMin(min);
      setMax(max);
      _setValue([min, max]);
    }
  }, [data]);

  useEffect(() => {
    const formatted_value = _value.map(String);
    const to = setTimeout(() => {
      setValue(formatted_value);
      if (props.onChange) {
        props.onChange(formatted_value);
      }
    }, 300);
    return () => clearTimeout(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_value]);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    return null;
  }

  return (
    <FormControl
      className="w-full"
      error={Boolean(errorMessage)}
      helperText={errorMessage}
    >
      <Typography id="budget-range-slider-label">
        {t("dApp:budget")}
      </Typography>
      <Slider
        value={_value}
        onChange={(e, value) => _setValue(value)}
        name={props.name}
        aria-labelledby="budget-range-slider-label"
        disabled={loading}
        max={max}
        min={min}
      />
      <div className="flex justify-between">
        <div className={classes.markLabel}>
          <MoneyFormatter
            data={parseInt(min)}
            noWarp={true}
            digit={0}
          />
        </div>
        <div>
          <MoneyFormatter
            data={_value[0] || 0}
            number={true}
            noWarp={true}
            digit={0}
          />
          {" - "}
          <MoneyFormatter
            data={_value[1] || 0}
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
  );
}

export default withFormsy(BudgetRanger);
