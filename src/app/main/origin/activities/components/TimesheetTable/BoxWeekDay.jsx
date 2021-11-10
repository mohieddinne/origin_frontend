import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Tooltip from "@material-ui/core/Tooltip";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import TimesheetContext from "./Context";
import clsx from "clsx";
import { isSameDay } from "@catu/helpers/dates.helpers";

function BoxWeekDay(props) {
  const { t } = useTranslation();
  const { data, index, day } = props;
  const { dates, setDates, hasData } = useContext(TimesheetContext);

  const isActive = !!dates.find((e) => isSameDay(e, day));

  const handleClick = (e) => {
    if (!hasData) return;
    let _dates = dates;
    console.log({ _dates });
    if (isActive) {
      _dates = _dates.filter((e) => !isSameDay(e, day));
    } else {
      _dates.push(day);
    }
    console.log({ _dates });
    setDates([..._dates]);
  };

  return (
    <div className="mx-8">
      <Tooltip title={<DateFormatter date={day} />}>
        <div
          role={hasData ? "button" : ""}
          onClick={handleClick}
          className={clsx(
            "border-1 mb-8 border-gray-700 text-white text-center justify-center w-32 h-28 flex items-center font-bold rounded-8",
            {
              "hover:bg-gray-500": hasData,
              "bg-gray-500": isActive || !hasData,
              "bg-gray-700": !isActive && hasData,
            }
          )}
        >
          {t(`calendar.week_day_` + index)[0]}
        </div>
      </Tooltip>
      <div className="mb-8 text-right">
        <MoneyFormatter
          data={(data?.hours || 0).toFixed(2)}
          digit={0}
          number={true}
        />
      </div>
      <div className="mb-8 text-right">
        <MoneyFormatter
          data={(data?.billableHours || 0).toFixed(2)}
          digit={0}
          number={true}
        />
      </div>
    </div>
  );
}

export default BoxWeekDay;
