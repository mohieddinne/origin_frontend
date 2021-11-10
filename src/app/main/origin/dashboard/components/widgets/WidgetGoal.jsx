import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { widgetIncomeVsGoals } from "app/services/originServices/dashboard.service";
import { nFormatter } from "../../helpers/formatter";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";

const useStyles = makeStyles(() => ({
  h240: {
    height: "255px",
  },
  indicator: {
    padding: "0.6rem 1rem",
    fontWeight: "800",
    borderRadius: "0.4rem",
    width: "51%",
  },
  red: {
    color: "#ffffff",
    background: "#f44336",
  },
  yellow: {
    color: "#6f6f6f",
    background: "#fde726",
  },
  orange: {
    color: "#FFFFFF",
    background: "#FBC02D",
  },
  green: {
    color: "#FFFFFF",
    background: "rgb(16, 185, 129)",
  },
}));

function WidgetGoal(props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState([]);
  const [goalKPI, setGoalKpi] = useState(null);
  const [data, setData] = useState({
    goal: [{ x: new Date( new Date().setMonth(new Date().getMonth()-1)), y: 0 }],
    income: [{ x: new Date(), y: 0 }],
    cumulativeIncome: [{ x: new Date(), y: 0 }],
  });

  const [detail, setDetail] = useState({
    weeksRemaining: 0,
    hoursOfGoal: 0,
    billableHours: {},
  });
  const user = useSelector(({ auth }) => auth.user.data.displayName);
  const responsible = props.employee ? props.employee : user;
  // const thisMonth = new Date().getMonth();
  // const thisYear = new Date().getFullYear();

  /* const filters = {
    invoice: ["1"],
    Responsable: [responsible],
    date_facturation_start:
      thisMonth <= 9
        ? new Date(`${thisYear - 1}-10-01`)
        : new Date(`${thisYear}-10-01`),
    date_facturation_end: new Date(),
  };*/

  useEffect(() => {
    setLoading(true);
    widgetIncomeVsGoals(responsible)
      .then((response) => {
        setDetail({
          weeksRemaining: response?.value,
          hoursOfGoal: response?.goal,
          billableHours: response?.billableHours,
        });
        const data = {};
        const lasts = {};
        response?.widget?.map((element) => {
          data[element.name] = element.data.map(({ name, value }) => {
            lasts[element.name] = value;
            return {
              x: name,
              y: value,
            };
          });

          return data[element.name];
        });
        setGoalKpi(lasts.cumulativeIncome / lasts.goal);
        setData(data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.employee]);

  const widget = {
    datasets: [
      {
        type: "line",
        label: t("dashApp:goal"),
        data: data.goal,
        fill: false,
        pointRadius: 0,
        lineTension: 0,
      },
      {
        type: "line",
        label: t("dashApp:billable_hours"),
        data: data.cumulativeIncome,
        fill: false,
        pointRadius: 0,
        lineTension: 0,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            distribution: "series",
            offset: true,
            ticks: {
              major: {
                enabled: false,
                fontStyle: "bold",
              },
              source: "data",
              autoSkip: true,
              autoSkipPadding: 40,
              maxRotation: 0,
              sampleSize: 30,
            },
            time: {
              displayFormats: { month: "MMM YYYY" },
              tooltipFormat: "DD/MM/YY",
              unit: "month",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            scaleLabel: {
              display: true,
              labelString: t("dashApp:hours"),
            },
          },
        ],
      },
      tooltips: {
        intersect: false,
        mode: "index",
        callbacks: {
          label: function (tooltipItem, myData) {
            var label =
              myData.datasets[tooltipItem.datasetIndex].label || "";
            if (label) {
              label += ": ";
            }
            label += nFormatter.format(tooltipItem.value);
            return label;
          },
        },
      },
    },
  };

  return (
    <Card
      className="w-full rounded-8 shadow-none border-1 p-16"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <div className="flex justify-between items-center w-full px-0 sm:px-8">
        <div className="flex-col w-2/3">
          <Typography className="h3" color="textSecondary">
            {t("dashApp:hours_v_goals")}
          </Typography>
          <Typography>
            {loading
              ? t("dashApp:calc_year_target")
              : detail && detail.hoursOfGoal
              ? t("dashApp:year_target", {
                  nbr: detail.hoursOfGoal,
                })
              : t("dashApp:no_year_target")}
          </Typography>
          <Typography>
            {loading
              ? t("dashApp:calc_weekly_target")
              : detail &&
                detail.weeksRemaining > 0 &&
                t("dashApp:weekly_target", {
                  nbr: detail.weeksRemaining.toFixed(1),
                })}
          </Typography>
          <Typography>
            {loading
              ? t("dashApp:calc_billable_hours")
              : detail &&
                detail.billableHours &&
                detail.billableHours.value > 0 && (
                  <>
                    {t("dashApp:billable_hours_value_p1", {
                      date: "1er Oct.",
                    })}
                    <span
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#039be5",
                      }}
                      onClick={() => {
                        history.push(
                          `/app/activities/not-billable-data/details`,
                          {
                            responsible,
                          }
                        );
                      }}
                    >
                      {detail.billableHours.value}
                    </span>
                  </>
                )}
          </Typography>
        </div>
        <div className="flex flex-wrap justify-end w-1/3">
          <div
            className={clsx(
              classes.indicator,
              {
                [classes.green]: goalKPI >= 1,
                [classes.orange]: goalKPI >= 0.9 && goalKPI < 1,
                [classes.yellow]: goalKPI >= 0.8 && goalKPI < 0.9,
                [classes.red]: goalKPI < 0.8,
              },
              "border-2 px-4 my-4 flex justify-center w-full"
            )}
          >
            <span className="px-4">
              {loading
                ? t("dashApp:actual_objectif_loading")
                : goalKPI === 0
                ? t("dashApp:no_actual_objectif")
                : t("dashApp:actual_objectif", {
                    nbr: goalKPI
                      ? `${(goalKPI * 100).toFixed(1)}%`
                      : "0%",
                  })}
            </span>
          </div>
          <div
            className={clsx(
              classes.indicator,
              "border-2 px-4 my-4 flex justify-center w-full"
            )}
          >
            <Typography>
              {loading
                ? t("dashApp:objectif_percent_loading")
                : widget?.datasets[1]?.data[
                    widget?.datasets[1]?.data.length - 1
                  ].y === 0
                ? t("dashApp:no_objectif_percent")
                : t("dashApp:objectif_percent", {
                    nbr:
                      (widget?.datasets[1]?.data[
                        widget?.datasets[1]?.data.length - 1
                      ].y /
                        detail.hoursOfGoal) *
                      100
                        ? (
                            (widget?.datasets[1]?.data[
                              widget?.datasets[1]?.data.length - 1
                            ].y /
                              detail.hoursOfGoal) *
                            100
                          ).toFixed(1)
                        : 0,
                  })}
            </Typography>
          </div>
        </div>
      </div>

      <div className={`w-full pt-24 ${classes.h240}`}>
        <Bar
          data={{
            datasets: widget.datasets.map((obj, index) => {
              const palette =
                theme.palette[index === 0 ? "primary" : "secondary"];
              return {
                ...obj,
                borderColor: palette.main,
                backgroundColor: palette.main,
                pointBackgroundColor: palette.dark,
                pointHoverBackgroundColor: palette.main,
                pointBorderColor: palette.contrastText,
                pointHoverBorderColor: palette.contrastText,
              };
            }),
          }}
          options={widget.options}
        />
      </div>

      <Divider className="my-16 " />

      <div className="flex flex-row justify-end ">
        <Button
          variant="outlined"
          color="default"
          disableElevation
          onClick={() => {
            history.push(`/app/activities/billable-data/details`, {
              responsible,
            });
          }}
        >
          {t("dashApp:see_activities")}
        </Button>
      </div>
    </Card>
  );
}

export default React.memo(WidgetGoal);
