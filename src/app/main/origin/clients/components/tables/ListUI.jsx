import React, { useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import * as Actions from "../../store/actions";
import SimpleFilterHandler from "./filter/SimpleFilterHandler";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import Export from "../ExportButton";
import ClientNumber from "../../../components/ClientNumber";
import TextTrimer from "@catu/components/TextTrimer";
import { ContextWrapper } from "./filter/FilterContext";
import AdvancedFiltersWrapper from "./advanced-filters/AdvancedFiltersWrapper";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    marginTop: "7rem",
  },
}));

function ListUI({ history, refetch, loading }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const data = useSelector(({ clientApp }) => clientApp.data);

  const options = useSelector(({ clientApp }) => clientApp.options);

  const viewContent = useCallback(
    (dataSelected) => {
      dispatch(Actions.setSelectedData(dataSelected));
      history.push(`/clients/item/${dataSelected.NumeroClient}`);
    },
    [dispatch, history]
  );

  const columns = useMemo(
    () => [
      {
        Header: t("cApp:customer_number"),
        accessor: "NumeroClient",
        sortable: true,
        width: "10%",
        Cell: ({ row, cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return <ClientNumber id={cell.value} />;
        },
      },
      {
        Header: t("cApp:client_name"),
        accessor: "NomClient",
        sortable: true,
        width: "40%",
        Cell: ({ cell: { value }, row: { original } }) => {
          if (!value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return (
            <ClientNumber
              id={original.NumeroClient}
              component="div"
              value={<TextTrimer string={value} length={80} />}
            />
          );
        },
      },
      {
        Header: t("cApp:client_type"),
        accessor: "TypeClient",
        width: "10%",
        sortable: true,
        responsive: "hidden sm:table-cell",
        Cell: ({ cell }) => {
          if (!cell.value)
            return (
              <span className="text-gray italic text-11 font-500 ">
                {t("not_defined")}
              </span>
            );
          let color = "blue";
          if (
            options &&
            Array.isArray(options.customers_type_color)
          ) {
            const item = options.customers_type_color.find(
              (element) => element.type === cell.value
            );
            if (item && item.color) {
              color =
                item.color === "yellow" ? "yellow-700" : item.color;
            }
          }
          return (
            <span
              className={`text-white text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap bg-${color}`}
            >
              {cell.value}
            </span>
          );
        },
      },
      {
        Header: t("cApp:city"),
        accessor: "Ville",
        responsive: "hidden md:table-cell",
        width: "20%",
        sortable: true,
      },

      {
        Header: t("customers.group"),
        accessor: "group",
        responsive: "hidden sm:table-cell",
        width: "10%",
        sortable: true,
        Cell: ({ cell }) => {
          const data = cell.value;
          const color = data && data.color ? data.color : "#9E9E9E";
          const value = data && data.name ? data.name : t("none");
          return (
            <span
              style={{ backgroundColor: color }}
              className={`text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap`}
            >
              {value}
            </span>
          );
        },
      },

      {
        Header: t("actions"),
        sortable: false,
        width: "10%",
        Cell: ({ row }) => (
          <>
            <IconButton
              size="small"
              onClick={() => viewContent(row.original)}
            >
              <VisibilityIcon size="small" />
            </IconButton>
            {/* <BtnDeleteClient id={row.original.NumeroClient} /> */}
          </>
        ),
      },
    ],
    [options, t, viewContent]
  );

  return (
    <ContextWrapper>
    <EnhancedTable
      title={t("cApp:list_of_customers")}
      selectable={false}
      loading={loading}
      className={classes.root}
      columns={columns}
      data={data || []}
      calbacks={{ Filter: SimpleFilterHandler, Export }}
      options={{
        refetch,
        special_filter: true,
        advanced_filter: true,
        subTitleComponemt: <AdvancedFiltersWrapper />,
      }}
    />
  </ContextWrapper>
  );
}

export default withRouter(ListUI);
