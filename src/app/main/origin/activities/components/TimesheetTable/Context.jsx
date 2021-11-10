import React, { useState } from "react";
import { formatLongDate } from "@catu/helpers/dates.helpers";

const TimesheetContext = React.createContext({});
export const TimesheetProvider = TimesheetContext.Provider;

export function TimesheetWrapper(props) {
  const [employee, setEmployee] = useState("");
  const [weekEnding, setWeekEnding] = useState(null);
  const [dates, setDates] = useState([]);
  const [hasData, setHasData] = useState(false);

  let filters = [];
  if (employee && weekEnding) {
    filters = [
      {
        name: "employee_id",
        value: [employee.toString()],
      },
      {
        name: "week_of_date",
        value: [formatLongDate(weekEnding)],
      },
    ];
  }

  return (
    <TimesheetContext.Provider
      value={{
        employee,
        setEmployee,
        weekEnding,
        setWeekEnding,
        filters,
        dates,
        setDates,
        hasData,
        setHasData,
      }}
    >
      {props.children}
    </TimesheetContext.Provider>
  );
}

export default TimesheetContext;
