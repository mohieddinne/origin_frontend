import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import TextTrimer from "@catu/components/TextTrimer";
import clsx from "clsx";
import * as kpisSrvs from "app/services/originServices/kpis.service";
import * as Actions from "../../store/actions";
import ExcelButton from "./excel/ExcelButton";

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
}));

function Widget(props) {
  // Props
  const { index } = props;
  // Hooks
  const classes = useStyles(props);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Redux data
  const math = useSelector(({ kpisApp }) => kpisApp.math[index]);
  const filters = useSelector(
    ({ kpisApp }) => kpisApp.filters[index]
  );
  // Local states
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOnChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    setLoading(true);
    dispatch(Actions.queueLoading());
    kpisSrvs
      .bestCustomers(math, filters, rowsPerPage)
      .then(({ data, options }) => {
        setData(data);
        setOptions(options);
        setLoading(false);
        dispatch(Actions.dequeueLoading());
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        dispatch(Actions.dequeueLoading());
      });
  }, [math, filters, rowsPerPage, dispatch]);

  const columns = useMemo(
    () => [
      {
        Header: t("kpisApp:customer.rank"),
        accessor: "id",
        width: "5%",
        sortable: true,
      },
      {
        id: "NumeroClient", // NumeroClient
        Header: t("kpisApp:customer.company_id"),
        accessor: "NumeroClient",
        width: "10%",
        sortable: true,
      },
      {
        Header: t("kpisApp:customer.name_short"),
        accessor: "client_name",
        // width: "auto",
        sortable: true,
        Cell: ({ cell }) => (
          <TextTrimer string={cell.value} length="30" />
        ),
      },
      {
        Header: t("kpisApp:number"),
        headerClasses: clsx({
          "bg-gray-200": math === "number",
          "text-right": true,
        }),
        className: math === "number" ? "bg-gray-200" : "",
        accessor: "folders",
        width: "20%",
        sortable: true,
        Cell: ({ cell }) => {
          return (
            <div
              className={clsx({
                "text-right mr-4": true,
                "bg-gray-200": math === "number",
              })}
            >
              {cell.value}
            </div>
          );
        },
      },
      {
        Header: t("kpisApp:income"),
        headerClasses: clsx({
          "bg-gray-200": math === "income",
          "text-right": true,
        }),
        className: math === "income" ? "bg-gray-200" : "",
        accessor: "income",
        width: "20%",
        sortable: true,
        Cell: ({ cell }) => {
          return (
            <div
              className={clsx({
                "text-right mr-4": true,
                "bg-gray-200": math === "income",
              })}
            >
              {cell.value}
            </div>
          );
        },
      },
      {
        Header: t("kpisApp:customer.type"),
        accessor: "client_type",
        //width: "10%",
        sortable: true,
        Cell: ({ cell, row }) => {
          const color = row.original.color;
          const classes = `text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap bg-${color}`;
          return <span className={classes}>{cell.value}</span>;
        },
      },
    ],
    [math, t]
  );

  // Formatter
  const crrncyfrmtr = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  });
  const nbrfrmtr = new Intl.NumberFormat("fr-CA");

  const rows = data.map((row, key) => {
    let color = "";
    color = (options.customers_type_color || []).find(
      (item) => item.type === row.TypeClient
    );
    if (color) {
      color = color.color === "yellow" ? "yellow-700" : color.color;
    } else {
      color = "blue";
    }
    return {
      id: key + 1,
      NumeroClient: row.NumeroClient,
      client_type: row.TypeClient,
      client_name: row.NomClient,
      folders: nbrfrmtr.format(row.folders),
      income: crrncyfrmtr.format(row.income),
      color,
    };
  });

  return (
    <Card
      className="w-full rounded-8 shadow-none border-1 p-16"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <div className="relative flex flex-row items-center justify-between mb-8">
        <Typography className="h3 sm:h2">
          {t(`kpisApp:${math}_titles.best_customers`)}
        </Typography>

        <FormControl
          className={classes.formControl}
          disabled={loading}
        >
          <InputLabel id="rows-per-page">
            {t("lines_to_show")}
          </InputLabel>
          <Select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handleOnChangeRowsPerPage}
            disabled={loading}
          >
            {[5, 10, 30, 50].map((item, key) => (
              <MenuItem value={item} key={key}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="table-responsive">
        <EnhancedTable
          columns={columns}
          data={rows}
          selectable={false}
          loading={loading}
          dense={true}
          classesNames="table-auto sm:table-fixed"
        />
      </div>
      <div className="flex flex-row justify-end">
        <ExcelButton index={index} widgetName={"bestClients"} />
      </div>
    </Card>
  );
}

export default React.memo(Widget);
