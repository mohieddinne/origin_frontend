import React, { useEffect } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { useTranslation } from "react-i18next";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { withFormsy } from "formsy-react";

const DATE_OPERATIONS = {
  IS_EQUAL_TO: "IS_EQUAL_TO",
  IS_NOT_EQUAL_TO: "IS_NOT_EQUAL_TO",
  IS_AFTER: "IS_AFTER",
  IS_BEFORE: "IS_BEFORE",
  IS_AFTER_OR_EQUAL_TO: "IS_AFTER_OR_EQUAL_TO",
  IS_BEFORE_OR_EQUAL_TO: "IS_BEFORE_OR_EQUAL_TO",
  IS_BETWEEN: "IS_BETWEEN",
  IS_SET: "IS_SET",
  IS_NOT_SET: "IS_NOT_SET",
};

function SharedFilterDateInput(props) {
  const { t } = useTranslation();
  const defaultValue = [
    DATE_OPERATIONS.IS_EQUAL_TO,
    new Date(),
    null,
  ];

  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage;
  const value = props.value || defaultValue;

  useEffect(() => {
    props.setValue(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeValue(index, new_value) {
    const data = [...value];
    data[index] = new_value;
    if (data[0] !== DATE_OPERATIONS.IS_BETWEEN) data[2] = null;
    else if (
      data[0] === DATE_OPERATIONS.IS_SET ||
      data[0] === DATE_OPERATIONS.IS_NOT_SET
    ) {
      data[1] = null;
      data[2] = null;
    }
    props.setValue(data);
    if (props.onChange) {
      props.onChange(data);
    }
  }

  const labelString =
    value[0] === DATE_OPERATIONS.IS_BETWEEN ? "date_start" : "date";

  const disableDate =
    value[0] === DATE_OPERATIONS.IS_SET ||
    value[0] === DATE_OPERATIONS.IS_NOT_SET;

  return (
    <div className="flex w-full">
      <FormControl fullWidth={true}>
        <InputLabel id="date-operation-label">
          {t("date_operations.label")}
        </InputLabel>
        <Select
          dense={true}
          value={value[0]}
          onChange={(e) => changeValue(0, e.target.value)}
          name="date_operation"
          labelId="date-operation-label"
          fullWidth={true}
        >
          {Object.keys(DATE_OPERATIONS).map((key) => (
            <MenuItem
              dense={true}
              value={DATE_OPERATIONS[key]}
              key={key}
            >
              {t("date_operations." + DATE_OPERATIONS[key])}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MuiPickersUtilsProvider name="date_start" utils={DateFnsUtils}>
        <KeyboardDatePicker
          // {...importedProps}
          disabled={disableDate}
          fullWidth={true}
          label={t("date_operations." + labelString)}
          value={value[1]}
          onChange={(v) => changeValue(1, v)}
          error={Boolean(errorMessage)}
          helperText={errorMessage}
          format="yyyy-MM-dd"
        />
      </MuiPickersUtilsProvider>
      {value[0] === DATE_OPERATIONS.IS_BETWEEN && (
        <MuiPickersUtilsProvider name="date_end" utils={DateFnsUtils}>
          <KeyboardDatePicker
            // {...importedProps}
            label={t("date_operations.date_end")}
            fullWidth={true}
            value={value[2]}
            onChange={(v) => changeValue(2, v)}
            error={Boolean(errorMessage)}
            helperText={errorMessage}
            format="yyyy-MM-dd"
          />
        </MuiPickersUtilsProvider>
      )}
    </div>
  );
}

export default React.memo(withFormsy(SharedFilterDateInput));
