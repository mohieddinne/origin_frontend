import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { handleFilters } from "app/services/originServices/kpis.service";
import dataQuery from "../../graphql/dataQuery.helper";
import { useQuery } from "@apollo/client";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import DatatableUI from "./DatatableUI";

function DataTableHandler({ math, widget, index = 0 }) {
  const { t } = useTranslation();
  const isIncome = math === "income";
  const filters = useSelector(({ kpisApp }) => {
    return handleFilters(kpisApp.filters[index]);
  });

  const [query, parts] = dataQuery(widget, math);

  const columns = useMemo(() => {
    let index = isIncome ? "value" : "nbr_folder";
    const columns = [];
    for (const part of parts) {
      if (part === "data") continue;
      // check then render methods;
      let Cell = ({ cell }) => cell.value;
      let Header = t(`kpisApp:dataTable.${part}`);
      if (part.indexOf("value") >= 0) {
        Header = t(`kpisApp:dataTable.${index}`);

        Cell = ({ cell }) => {
          if (index === "value") {
            return (
              <MoneyFormatter
                data={cell.value}
                className="block text-right"
                digit={0}
              />
            );
          } else return cell.value;
        };
      }
      if (part.indexOf("name") >= 0) {
        Header = t(`kpisApp:dataTable.${widget}`);
        Cell = ({ cell }) => {
          if (!cell.value)
            return (
              <span className="font-bold ">
                {t("kpisApp:not_specified")}
              </span>
            );
          else return cell.value;
        };
      }
      if (part.indexOf("office") >= 0) {
        Cell = ({ cell }) => {
          if (!cell.value)
            return (
              <span className="font-bold ">
                {t("kpisApp:not_specified")}
              </span>
            );
          else return cell.value;
        };
      }
      if (part.indexOf("Date") >= 0)
        Cell = ({ cell }) => (
          <DateFormatter
            date={cell.value}
            className="block text-center"
          />
        );

      columns.push({
        Header,
        accessor: part,
        sortable: true,
        Cell,
      });
    }

    return columns;
  }, [isIncome, parts, t, widget]);

  const { data, loading, error } = useQuery(query, {
    variables: {
      widget: unslugify(widget),
      math,
      filters,
    },
  });

  const tableProps = { data: [], loading, error, columns };

  if (data && Array.isArray(data.kpi_widgets_data))
    tableProps.data = data.kpi_widgets_data;

  return (
    <DatatableUI
      tableProps={tableProps}
      widget={widget}
      math={math}
      index={index}
    />
  );
}

export default DataTableHandler;

function unslugify(string) {
  const array = string.split("-");
  return array
    .map((word, key) =>
      key === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}
