import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import TimesheetContext from "./Context";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import FuseUtils from "@fuse/FuseUtils";
import { useEffect } from "react";
import { isValidDate } from "@catu/helpers/dates.helpers";

const query = gql`
  query filtersActivity {
    me {
      NomEmploye
      id_Emp
    }
    filtersActivity(slugs: [EMPLOYEES]) {
      name
      data {
        id
        value
        ... on ActivityFilterEmployee {
          active
        }
      }
    }
  }
`;

export default function TimesheetFilter() {
  const { t } = useTranslation("activities");
  const history = useHistory();

  const {
    employee,
    setEmployee,
    weekEnding,
    setWeekEnding,
  } = useContext(TimesheetContext);

  const haViewActivities = FuseUtils.hasPermission({
    slug: "activities",
    permission: "can_view",
  });

  const { loading, data } = useQuery(query);

  const employees = [];
  if (haViewActivities) {
    employees.push(...(data?.filtersActivity[0]?.data || []));
  } else if (data?.me) {
    employees.push({
      id: data.me.id_Emp,
      value: data.me.NomEmploye,
    });
  }

  useEffect(() => {
    let myId = data?.me?.id_Emp || null;
    if (!myId || employee) return null;
    const iAmOnTheList = !!employees.find((e) => e.id === myId);
    if (!employee && iAmOnTheList) {
      setEmployee(data.me.id_Emp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee, data?.me?.id_Emp, employees]);

  return (
    <div
      utils={DateFnsUtils}
      className="mx-16 mb-16 my-0 p-12 rounded-8 shadow-none border-1 flex flex-wrap sm:flex-nowrap gap-16"
    >
      <FormControl variant="outlined" className="w-full">
        <InputLabel id="filters-staff-label">
          {t("translation:employee", { count: employees.length })}
        </InputLabel>
        <Select
          id="filters-employee"
          name="employee_id"
          variant="outlined"
          value={employee}
          onChange={(event) => {
            setEmployee(event.target.value);
          }}
          fullWidth
          labelId="filters-staff-label"
          input={
            <OutlinedInput
              labelWidth={
                (t("translation:employee") || "").length * 8
              }
              id={"employee_id"}
              name={"employee_id"}
              fullWidth
            />
          }
          disabled={loading}
        >
          {employees.map(({ value, id, active }) => (
            <MenuItem
              className={!active ? "text-gray-500" : "text-black"}
              value={id}
              key={id}
              dense={true}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="w-3/5 sm:w-full">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            inputVariant="outlined"
            className="w-full"
            label={t("timesheet-view.week_ending")}
            invalidDateMessage={
              <>{t("translation:error.form.date")}</>
            }
            format="yyyy-MM-dd"
            value={weekEnding}
            InputAdornmentProps={{
              position: "end",
            }}
            disabled={loading}
            onChange={(date) => {
              if (isValidDate(date)) {
                setWeekEnding(date);
              }
            }}
          />
        </MuiPickersUtilsProvider>
      </div>
      <Button
        variant="contained"
        color="secondary"
        className="px-48 w-1/3 sm:w-auto"
        onClick={() => history.push(`/app/activities/item/new`)}
        disableElevation
      >
        Ajouter
      </Button>
    </div>
  );
}
