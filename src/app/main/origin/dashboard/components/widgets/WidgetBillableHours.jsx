import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import { makeStyles } from "@material-ui/styles";
// import { useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuItem from "@material-ui/core/MenuItem";
// import { Bar } from "react-chartjs-2";
// import Divider from "@material-ui/core/Divider";
// import { nFormatter } from "../../helpers/formatter";
import { Button, Select } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useSelector } from "react-redux";

/* const useStyles = makeStyles(() => ({
  h240: {
    height: "255px",
  },
  indicator: {
    padding: "0.6rem 1rem",
    fontWeight: "800",
    borderRadius: "0.4rem",
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
}));*/

const query = gql`
  query WidgetBillableHours($responsible: String, $type: Int) {
    WidgetBillableHours(responsible: $responsible, type: $type) {
      totalBillableHours
      totalPerYearData {
        numberOfBillableHours
        date
      }
      graphData {
        numberOfBillableHours
        date
      }
    }
  }
`;

function WidgetBillableHours(props) {
  const history = useHistory();

  const [selectedType, setSelectedType] = useState(1);

  // const theme = useTheme();
  const { t } = useTranslation();
  // const classes = useStyles();
  const user = useSelector(({ auth }) => auth.user.data.displayName);
  const responsible = props?.employee || user;
  const { data, loading } = useQuery(query, {
    variables: { responsible, type: selectedType },
  });

  const types = [
    {
      name: t("dashApp:employee"),
      value: 1,
    },
    {
      name: t("dashApp:responsible"),
      value: 0,
    },
  ];

  /*  
  const widget = {
    datasets: [
      {
        type: "line",
        label: t("dashApp:billable_hour"),
        data: data?.WidgetBillableHours?.graphData?.map((el) => {
          return {
            x: new Date(parseInt(el.date)),
            y: el.numberOfBillableHours,
          };
        }),
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
                enabled: true,
                fontStyle: "bold",
              },
              source: "data",
              autoSkip: true,
              autoSkipPadding: 75,
              maxRotation: 0,
              sampleSize: 100,
            },
            time: {
              displayFormats: { day: "MM/YY" },
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
  };*/

  return (
    <Card
      className="w-full rounded-8 shadow-none border-1 p-16"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <div className="flex justify-between items-end w-full px-0 sm:px-8">
        <div className="flex-col">
          <Typography className="h3" color="textSecondary">
            {t("dashApp:billable_hour")}
          </Typography>
          <div className="w-full">
            <Select
              className="w-1/2"
              id="type_of_filter"
              value={selectedType}
              variant="outlined"
              onChange={(ev) => {
                setSelectedType(ev?.target?.value);
              }}
              name="type_of_filter"
              disabled={loading}
            >
              {(types || []).map(({ name, value }, key) => (
                <MenuItem value={value} key={key}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Typography className="h-4 py-4">
            {loading
              ? t("dashApp:totalbh_loading")
              : data?.WidgetBillableHours?.totalBillableHours === 0
              ? t("dashApp:no_totalbh")
              : t("dashApp:totalbh", {
                  totalbh: (
                    Math.round(
                      data?.WidgetBillableHours?.totalBillableHours *
                        100
                    ) / 100
                  ).toFixed(2),
                })}
          </Typography>
          <div className="flex flex-wrap my-8 py-4">
            {loading ? (
              <div className="w-full my-8">
                {t("loading")}
                <LinearProgress variant="query" />
              </div>
            ) : (
              data?.WidgetBillableHours?.totalPerYearData?.map(
                (item, key) => {
                  return (
                    <Button
                      onClick={() => {
                        const date_start = `${item.date}-01-01`;
                        const date_end = `${item.date}-12-31`;
                        history.push(
                          `/app/activities/billable-data-active-folders/details`,
                          {
                            responsible,
                            year: item.date,
                            type: selectedType,
                            filters: {
                              Responsable: [responsible],
                              invoice: ["0"],
                              date_start,
                              date_end,
                            },
                          }
                        );
                      }}
                      variant="outlined"
                      className="border-2 px-4 my-8 mr-4 flex flex-nowrap"
                      key={key}
                    >
                      <Typography>
                        <span className="font-900">
                          {item.date + " : "}
                        </span>
                        {item.numberOfBillableHours + "h"}
                      </Typography>
                    </Button>
                  );
                }
              )
            )}
          </div>
          <Typography>
            {t("dashApp:billed_hours_description")}
          </Typography>
        </div>
      </div>
      <div className="flex flex-row justify-end">
        <Button
          variant="outlined"
          color="default"
          disableElevation
          onClick={() => {
            history.push(
              `/app/activities/billable-data-active-folders/details`,
              {
                responsible,
                type: selectedType,
                filters: {
                  Responsable: [responsible],
                  invoice: ["0"],
                },
              }
            );
          }}
        >
          {t("dashApp:see_activities")}
        </Button>
      </div>
      {/* <div className={`w-full pt-24 ${classes.h240}`}>
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
      </div> */}
      {/* 
      <Divider className="my-16 " /> */}
    </Card>
  );
}

export default React.memo(WidgetBillableHours);
