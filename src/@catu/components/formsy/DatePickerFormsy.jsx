import React from "react";
import { useTranslation } from "react-i18next";
import { withFormsy } from "formsy-react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import clsx from "clsx";

function DatePickerFormsy(props) {
  const { t } = useTranslation();
  // const classes = useStyles();

  // An error message is returned only if the component is invalid
  const { errorMessage, value, setValue } = props;

  const changeValue = (event, value) => {
    props.setValue(event);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  if (!value) setValue(new Date());
  return (
    <div className={clsx("flex flex-wrap w-full", props.className)}>
      <MuiPickersUtilsProvider name={props.name} utils={DateFnsUtils}>
        <KeyboardDatePicker
          disabled={false}
          name={props.name}
          variant="inline"
          inputVariant="outlined"
          className="w-full md:w-1/2 mb-4"
          fullWidth
          format="dd/MM/yyyy"
          label={t("activities:activity_date")}
          value={value}
          onChange={changeValue}
          error={Boolean(errorMessage)}
          helperText={errorMessage}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}

export default withFormsy(DatePickerFormsy);
