import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import { widgetBvNbHours } from "app/services/originServices/dashboard.service";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import FolderNumber from "../../../components/FolderNumber";
import clsx from "clsx";
import { Icon } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  arrayBadge: {
    width: "10px",
    height: "10px",
    display: "inline-block",
    background: "grey",
    borderRadius: "100%",
    margin: "0px 0px 0px 5px",
  },
  widget: {
    "@media screen and (min-width: 320px)": {
      display: "flex",
      flexWrap: "wrap",
      //flexDirection: "column",
    },
  },
  // lines: {
  //   "@media screen and (min-width: 320px)": {
  //     width: "90px",
  //   },
  //   "@media screen and (min-width: 780px)": {
  //     width: "180px",
  //   },
  //   "@media screen and (min-width: 1024px)": {
  //     display: "flex",
  //     alignItems: "end",
  //     //  : "flex-end";
  //   },
  // },
  //
  // filter: {
  //   "@media screen and (min-width: 320px)": {
  //     display: "flex",
  //     flexWrap: "wrap",
  //   },
  // },
  // "@media screen and (min-width: 700px)": {
  //   display: "flex",
  //   flexWrap: "wrap",
  // },
  //},
}));

function WidgetHoursNotBilledInClosedFolders(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [compareValueError, setCompareValueError] = useState(false);
  const [operator, setOperator] = useState(">=");
  const [compareValue, setCompareValue] = useState(500);
  const [dataCount, setDataCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateSorter, setDateSorter] = useState("date_mandat");
  const [loading, setLoading] = useState(false);

  const operators = [
    { name: t("dashApp:superior"), value: ">=" },
    { name: t("dashApp:inferior"), value: "<=" },
  ];

  const possibleDatesSorters = [
    {
      name: t("dashApp:date_mandat"),
      value: "date_mandat",
    },
    {
      name: t("dashApp:date_cloture"),
      value: "closing_date",
    },
  ];

  useEffect(() => {
    queryData(
      { rowsPerPage, dateSorter, operator, compareValue },
      props.employee
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, dateSorter, props.employee]);

  const queryData = (
    { rowsPerPage, dateSorter, operator, compareValue },
    employee
  ) => {
    setLoading(true);
    widgetBvNbHours(
      { rowsPerPage, dateSorter, operator, compareValue },
      employee
    )
      .then(({ data }) => {
        setLoading(false);
        setDataCount((data || {}).count || 0);
        const dat = ((data || {}).table || []).map((item) => {
          const pf_nf =
            item.billed > 0
              ? (item.billed * 100) / (item.billed + item.noneBilled)
              : 100;
          // Manage colors by options
          let pColor = "green";
          if (item.budget < item.billed + item.noneBilled) {
            pColor = "red";
          }
          return {
            budget: item.budget,
            folder_id: item.folder,
            pf_nf: {
              value: Math.round(pf_nf * 100) / 100,
              color: pColor, // black, gray, orange, yellow, green, teal, blue, indigo, purple, pink,
            },
            h_n_billed: item.noneBilled,
            billed: item.billed,
            amountBilled: item.amountBilled,
            amountNoneBilled: item.amountNoneBilled,
            sumExpenses: item.sumExpenses,
          };
        });
        setData(dat);
      })
      .catch((error) => {
        setLoading(false);
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      });
  };

  const applyFilter = () => {
    if (operator && !isNaN(compareValue)) {
      setCompareValueError(false);
      queryData(
        { rowsPerPage, dateSorter, operator, compareValue },
        props.employee
      );
    } else if (!operator) {
      setCompareValue("");
      setCompareValueError(false);
      queryData(
        {
          rowsPerPage,
          dateSorter,
          operator: null,
          compareValue: null,
        },
        props.employee
      );
    } else if (!compareValue) {
      setCompareValueError(true);
    }
  };

  const handleOnChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value, 10);
  };

  const handleOnChangeDateSorter = (event) => {
    setDateSorter(event.target.value);
  };

  const handleChangeOperator = (ev) => {
    setOperator(ev.target.value);
  };

  const handleChangeCompareValue = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || value < 0) setCompareValueError(true);
    else setCompareValueError(false);
    setCompareValue(value);
  };

  const formatter = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  });

  const columns = [
    {
      id: "folder",
      title: t("dashApp:folder"),
    },
    {
      id: "p_f_nf",
      classes: "text-right",
      title: t("dashApp:a_f_nf"),
    },
    {
      id: "none_billed_hours",
      title: t("dashApp:none_billed_hours"),
    },
    /*{
      id: "sumExpenses",
      title: t("dashApp:sumExpenses"),
    }*/
  ];

  const rows = data.map((row) => {
    return {
      id: row.id,
      cells: [
        {
          id: "folder_id",
          value: (
            <FolderNumber id={row.folder_id} value={row.folder_id} />
          ),
        },
        {
          id: "pf_nf",
          value: (
            <div className="text-right">
              <span>
                {
                  <MoneyFormatter
                    data={row.amountNoneBilled}
                    digit={0}
                  />
                }
              </span>
              <span className="text-grey">
                | <MoneyFormatter data={row.amountBilled} digit={0} />
              </span>
              <Tooltip
                title={t("dashApp:budget_count", {
                  count: formatter.format(row.budget),
                })}
                aria-label="budget"
              >
                <span
                  className={classes.arrayBadge}
                  style={{
                    background:
                      row && row.pf_nf && row.pf_nf.color
                        ? row.pf_nf.color
                        : "grey",
                  }}
                ></span>
              </Tooltip>
            </div>
          ),
        },
        {
          id: "h_n_billed",
          value: (
            <>
              {row.h_n_billed}
              {row.billed ? (
                <span className="text-grey"> / {row.billed}</span>
              ) : (
                <span className="text-grey"> / 0</span>
              )}
            </>
          ),
        },
        // {
        //   id: "sumExpenses",
        //   value: (
        //     <MoneyFormatter
        //       data={row.sumExpenses}
        //       digit={0}
        //       className="block w-full text-right md:pr-16"
        //     />
        //   ),
        // },
      ],
    };
  });

  return (
    <Card className="w-full rounded-8 shadow-none border-1 p-16">
      <div className={clsx(classes.widget, "flex justify-between")}>
        <div className="flex flex-wrap items-center sm:w-full sm:justify-between">
          <Typography
            className="h3 sm:h2 p-4 w-2/3"
            color="textSecondary"
          >
            {t("dashApp:hours_not_billed_in_closed_folders")}
          </Typography>
          <Chip
            label={t(
              `dashApp:${
                dataCount > 0 ? "n_folder_plural" : "n_folder"
              }`,
              { count: dataCount }
            )}
            className="pl-8 w-1/3 sm:w-auto"
            color="secondary"
          />
        </div>
        <div className="w-full sm:flex max-w-2xl">
          <div className="flex mt-16 mb-8 sm:w-2/3 sm:flex-wrap">
            <FormControl
              className="w-2/5"
              disabled={loading}
              variant="outlined"
            >
              <InputLabel id="operator-label-id">
                {t("dashApp:operator")}
              </InputLabel>
              <Select
                labelId="operator-label-id"
                id="operator"
                value={operator}
                onChange={handleChangeOperator}
                label={t("dashApp:operator")}
              >
                <MenuItem value="">
                  <em>{t("none")}</em>
                </MenuItem>
                {operators.map((item, key) => (
                  <MenuItem value={item.value} key={key}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="w-2/5 pl-8" disabled={loading}>
              <TextField
                error={compareValue < 0 && compareValueError}
                type="number"
                autoComplete="off"
                value={compareValue}
                disabled={loading}
                variant="outlined"
                inputProps={{
                  min: 0,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
                id="compare_value-id"
                label={t("dashApp:compare_value")}
                onChange={handleChangeCompareValue}
              />
            </FormControl>
            <div className="pl-8 sm:w-1/5">
              <Button
                color="primary"
                variant="outlined"
                className="h-full sm:w-full"
                disabled={loading}
                onClick={() => applyFilter()}
              >
                <Icon>send</Icon>
                {/*<span className="hidden md:block">
                  {t("dashApp:apply_filter")}
                </span>*/}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap sm:w-1/3 mt-16 mb-8 pl-8">
            <FormControl
              className="w-1/2 pr-4"
              disabled={loading}
              variant="outlined"
            >
              <InputLabel id="lines-to-show-label-id">
                {t("lines_to_show")}
              </InputLabel>
              <Select
                labelId="lines-to-show-label-id"
                id="lines_to_show-id"
                value={rowsPerPage}
                onChange={handleOnChangeRowsPerPage}
                label={t("lines_to_show")}
              >
                {[5, 10, 30, 50, t("dashApp:all")].map(
                  (item, key) => (
                    <MenuItem value={item} key={key}>
                      {item}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl
              className="w-1/2 pl-4"
              disabled={loading}
              variant="outlined"
            >
              <InputLabel id="sort_date-label-id">
                {t("sort_date")}
              </InputLabel>
              <Select
                labelId="sort_date-label-id"
                id="sort_date-id"
                value={dateSorter}
                onChange={handleOnChangeDateSorter}
                label={t("sort_date")}
              >
                {possibleDatesSorters.map((item, key) => (
                  <MenuItem value={item.value} key={key}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <Table className="w-full min-w-full" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  className={clsx("whitespace-nowrap", {
                    [column.classes]: !!column.classes,
                  })}
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(rows) && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={(columns || []).length}>
                  <div className="full-w text-center p-16">
                    {loading ? t("loading") : t("no_data")}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              (rows || []).map((row, key) => (
                <TableRow key={key}>
                  {row.cells.map((cell, key) => (
                    <TableCell key={key} component="th" scope="row">
                      <div className={cell.classes}>{cell.value}</div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-row justify-end my-16"></div>
    </Card>
  );
}

export default React.memo(WidgetHoursNotBilledInClosedFolders);
