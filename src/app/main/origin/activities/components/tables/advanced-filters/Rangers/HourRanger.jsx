import React, { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import { useQuery, gql } from "@apollo/client";
import { withFormsy } from "formsy-react";

const query = gql`
  query filtersActivity($search: String) {
    filtersActivity(slugs: [HOURLY_RATES, HOURS], search: $search) {
      name
      data {
        id
        ... on ActivityFilterFolder {
          budget
          consummated
        }
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

function HourRanger(props) {
  const classes = useStyle();
  const { t } = useTranslation();

  const { errorMessage, value, setValue } = props;

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [_value, _setValue] = useState([0, 100]);
  const { data, loading, error } = useQuery(query);
  useEffect(() => {
    if (
      Array.isArray(data?.filtersActivity) &&
      data.filtersActivity[0]?.data
    ) {
      const range = data.filtersActivity[0].data;
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
        {t(`activities:${props.name}`)}
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
          <span>{parseInt(min)}-H</span>
        </div>
        <div>
          <span>{_value[0]} </span>
          {" - "}
          <span>{_value[1]}H </span>
        </div>
        <div className={classes.markLabel}>{max}-H</div>
      </div>
    </FormControl>
  );
}

export default withFormsy(HourRanger);
