import { useContext } from "react";
import { daysOfAWeek } from "@catu/helpers/dates.helpers";
import BoxWeekDay from "./BoxWeekDay";
import { useTranslation } from "react-i18next";
import TimesheetContext from "./Context";
import clsx from "clsx";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  container: {
    "&.no-data > *": {
      opacity: "0.5",
    },
  },
}));

export default function DateBox({ data }) {
  const classes = useStyles();
  const { t } = useTranslation("activities");
  const { weekEnding, dates, setDates, hasData } =
    useContext(TimesheetContext);

  const weekEndDate = new Date(weekEnding);
  const weekDays = daysOfAWeek(weekEndDate);

  const weekData = {};
  const totals = { hours: 0, billableHours: 0 };
  for (const activity of data || []) {
    const activityDate = new Date(parseInt(activity.date));
    const day = activityDate.getDay();
    if (!weekData[day])
      weekData[day] = { hours: 0, billableHours: 0 };
    weekData[day].hours += activity.hours;
    weekData[day].billableHours += activity.billableHours;
    totals.hours += activity.hours;
    totals.billableHours += activity.billableHours;
  }
  const handleResetfilters = (e) => {
    setDates([]);
  };

  return (
    <div
      className={clsx(
        classes.container,
        "bg-white rounded-8 border-1 flex gap-8 sticky bottom-0 z-9999 overflow-x-scroll",
        "bottom-0 m-0 mt-16 p-12 shadow-2xl",
        "sm:bottom-16 sm:m-16 sm:pb-0",
        { "no-data": !hasData }
      )}
    >
      <div>
        <div className="py-4">
          <span className="hidden sm:block">Semaine</span>
          <span className="block sm:hidden">S</span>
        </div>
        <div className="py-4">
          <span className="hidden sm:block">Heures</span>
          <span className="block sm:hidden">H</span>
        </div>
        <div className="py-4">
          <span className="hidden sm:block">Heures facturées</span>
          <span className="block sm:hidden">HF</span>
        </div>
      </div>
      {Array.from({ length: 7 }).map((e, i) => (
        <BoxWeekDay
          day={weekDays[i]}
          data={weekData[i]}
          index={i}
          key={i}
        />
      ))}
      <div className="mx-8">
        <div
          role={hasData ? "button" : ""}
          onClick={handleResetfilters}
          className={clsx(
            "border-1 mb-8 border-gray-700 text-white text-center justify-center w-32 sm:w-auto sm:px-8 h-28 flex items-center font-bold rounded-8",
            {
              "hover:bg-gray-500": hasData,
              "bg-gray-500": dates.length === 0 || !hasData,
              "bg-gray-700": dates.length > 0,
            }
          )}
        >
          <span className="hidden sm:block">{t("total")}</span>
          <span className="block sm:hidden">T</span>
        </div>
        <div className="mb-8 text-right">
          <MoneyFormatter
            data={(totals.hours || 0).toFixed(2)}
            digit={0}
            number={true}
          />
        </div>
        <div className="mb-8 text-right">
          <MoneyFormatter
            data={(totals.billableHours || 0).toFixed(2)}
            digit={0}
            number={true}
          />
        </div>
      </div>
    </div>
  );
}
