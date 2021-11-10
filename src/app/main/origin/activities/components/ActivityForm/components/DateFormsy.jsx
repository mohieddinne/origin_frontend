import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import { withFormsy } from "formsy-react";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { daysOfAWeek, isSameDay } from "@catu/helpers/dates.helpers";
import clsx from "clsx";

function ActivityDateFormsy(props) {
  const { t } = useTranslation();

  // An error message is returned only if the component is invalid
  const { errorMessage, value } = props;
  const today = new Date();
  const days = daysOfAWeek(today);

  const changeValue = (date) => {
    props.setValue(date);
    if (props.onChange) {
      props.onChange(date);
    }
  };

  useEffect(() => {
    if (!value) {
      props.setValue(new Date());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx("flex flex-wrap w-full", props.className)}>
      <MuiPickersUtilsProvider name={props.name} utils={DateFnsUtils}>
        <KeyboardDatePicker
          disabled={false}
          name={props.name}
          variant="inline"
          inputVariant="outlined"
          className="w-full"
          format="dd/MM/yyyy"
          label={t("activities:activity_date")}
          value={value}
          onChange={changeValue}
          error={Boolean(errorMessage)}
          helperText={errorMessage}
        />
      </MuiPickersUtilsProvider>
      <div className="bg-gray-200 rounded-b-xl flex mx-12 sm:mx-auto">
        <div className="flex flex-wrap justify-evenly">
          {days.map((item, index) => {
            const date = item.toString();
            return (
              <Button
                key={index}
                onClick={() => props.setValue(item)}
                disabled={isSameDay(value, item)}
              >
                <span>{date[0]}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(withFormsy(ActivityDateFormsy));
