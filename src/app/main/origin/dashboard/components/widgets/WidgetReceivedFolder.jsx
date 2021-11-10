import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
// import { useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import FuseUtils from "@fuse/FuseUtils";

import Badge from "@material-ui/core/Badge";
import { widgetReceivedFolder } from "app/services/originServices/dashboard.service";
import MyProjectsButton from "../buttons/MyProjects";

function WidgetReceivedFolder(props) {
  const { t } = useTranslation();
  // const theme = useTheme();

  const useStyles = makeStyles((theme) => ({
    badge: {
      background:
        data && data.indicatorColor ? data.indicatorColor : "grey",
      top: "20px",
      right: "-20px",
    },
    arrayBadge: {
      width: "10px",
      height: "10px",
      display: "inline-block",
      background: "grey",
      borderRadius: "100%",
      margin: "0px 0px 3px 5px",
    },
  }));

  const [filters, setFilters] = useState("Dossiers actifs");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    activeFolders: 0,
    indicatorColor: "grey",
    graph: [],
    graphColor: "grey",
    array: [
      {
        label: t("calendar.nDay", { count: 7 }),
        number: 0,
        color: "grey",
        change: 0,
      },
      {
        label: t("calendar.nDay", { count: 30 }),
        number: 0,
        color: "grey",
        change: 0,
      },
      {
        label: t("calendar.nMonth", { count: 3 }),
        number: 0,
        color: "grey",
        change: 0,
      },
    ],
  });

  const genLabel = (v) => {
    switch (v) {
      case "this_month":
        return t("calendar.nDay", { count: 30 });
      case "this_quarter":
        return t("calendar.nMonth", { count: 3 });
      default:
        return t("calendar.nDay", { count: 7 });
    }
  };

  useEffect(() => {
    setLoading(true);
    widgetReceivedFolder(props.employee, filters)
      .then((data) => {
        setData({
          activeFolders: data.active,
          indicatorColor: "#039be6",
          graph: data.graph,
          array: (data.data || []).map((e) => ({
            label: genLabel(e.type),
            number: e.value,
            change: e.change,
            color: "#039be6",
          })),
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.employee, t, filters]);

  // const chartData = {
  //   chartType: "line",
  //   datasets: [
  //     {
  //       label: t("dashApp:folder", { count: 2 }),
  //       data: (data.graph || []).map((e) => e.value),
  //       fill: false,
  //     },
  //   ],
  //   labels: (data.graph || []).map((e) => e.name),
  //   options: {
  //     spanGaps: false,
  //     legend: {
  //       display: false,
  //     },
  //     maintainAspectRatio: false,
  //     elements: {
  //       point: {
  //         radius: 2,
  //         borderWidth: 1,
  //         hoverRadius: 2,
  //         hoverBorderWidth: 1,
  //       },
  //       line: {
  //         tension: 0,
  //       },
  //     },
  //     layout: {
  //       padding: {
  //         top: 24,
  //         left: 16,
  //         right: 16,
  //         bottom: 16,
  //       },
  //     },
  //     scales: {
  //       xAxes: [{ display: false }],
  //       yAxes: [{ display: false, ticks: {} }],
  //     },
  //   },
  // };

  const classes = useStyles(props);
  const handleChange = (event) => {
    const value = event.target.value;
    setFilters(value);
    setLoading(true);
    widgetReceivedFolder(props.employee, value).then((data) => {
      setData({
        activeFolders: data.active,
        indicatorColor: "#039be6",
        graph: data.graph,
        array: (data.data || []).map((e) => ({
          label: genLabel(e.type),
          number: e.value,
          change: e.change,
          color: "#039be6",
        })),
      });
      setLoading(false);
    });
  };

  return (
    <Card
      className="w-full rounded-8 shadow-none border-1 p-16"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <Typography className="h3" color="textSecondary">
        {t("dashApp:received_active_folders")}
      </Typography>
      <OutlinedSelect
        id="filters-active-closed-folder"
        name="active-folder"
        variant="outlined"
        value={filters}
        onChange={handleChange}
        label={t("dashApp:project-state")}
        disabled={loading}
      >
        {["Dossiers actifs", "Dossiers reçus"].map((item, key) => {
          return (
            <MenuItem value={item} key={key} dense={true}>
              {item}
            </MenuItem>
          );
        })}
      </OutlinedSelect>
      <div className="flex flex-row flex-wrap items-end h-96 mb-32 justify-center">
        <Typography className="text-56 font-300 leading-none mt-8">
          <Badge badgeContent={""} classes={{ badge: classes.badge }}>
            {data.activeFolders}
          </Badge>
        </Typography>
        <div className="ml-40 text-16 w-1/2 flex flex-row items-center">
          <Typography className="whitespace-normal">
            {t("dashApp:total_of_received_actif_folders", {
              // eslint-disable-next-line
              state: filters == "Dossiers actifs" ? "actifs" : "reçu",
            })}
          </Typography>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center pt-32">
        {data.array.map((item, index) => (
          <div
            key={index}
            className="px-16 flex flex-col items-center"
          >
            <Typography className="h4" color="textSecondary">
              {item.label}
            </Typography>
            <Typography className="h2 font-300 py-8">
              {item.number}
              <span
                className={classes.arrayBadge}
                style={{ background: item.color }}
              ></span>
            </Typography>

            {/* <div className="flex flex-row items-center justify-center">
              {item.change < 0 && (
                <Icon className="text-18 text-red">
                  arrow_downward
                </Icon>
              )}

              {item.change > 0 && (
                <Icon className="text-18 text-green">
                  arrow_upward
                </Icon>
              )}
              <div className="h5 px-4">
                {Math.round(item.change)}%
              </div>
            </div> */}
          </div>
        ))}
      </div>

      <Divider className="my-16" />
      <div className="flex flex-row justify-end">
        <TECButton employee={props.employee} />
        <MyProjectsButton
          // eslint-disable-next-line eqeqeq
          active={filters == "Dossiers actifs" ? true : false}
          employee={props.employee || null}
        />
      </div>
    </Card>
  );
}

function TECButton({ employee }) {
  const { t } = useTranslation();

  const history = useHistory();
  const hasAccessReport = FuseUtils.hasPermission("reports-tec");

  if (!hasAccessReport) return null;

  // Send the data
  const handleClick = () => {
    history.push(`/app/report-tec`, { employee });
  };

  return (
    <Button
      variant="outlined"
      className="mr-8"
      disableElevation
      onClick={handleClick}
    >
      {t("kpisApp:button_list_report")}
    </Button>
  );
}

function OutlinedSelect(props) {
  return (
    <FormControl variant="outlined" className="w-full mt-16">
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Select
        {...props}
        input={
          <OutlinedInput
            labelWidth={(props.label || "").length * 8}
            id={props.name}
            name={props.name}
          />
        }
      >
        {props.children}
      </Select>
    </FormControl>
  );
}
export default WidgetReceivedFolder;
