import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import { useSelector } from "react-redux";
import { handleFilters } from "app/services/originServices/kpis.service";
import detailsQuery from "../../graphql/detailsQuery.helper";
import FolderNumber from "../../../components/FolderNumber";

const useStyles = makeStyles({
  root: {
    background: "#f4f4f4",
  },
});

function SubRow({ row, widget, math, index }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [query, parts] = detailsQuery(widget, math);
  const filters = useSelector(({ kpisApp }) => {
    return kpisApp.filters[index];
  });

  if (row.original) {
    for (const property in row.original) {
      if (property === "value") continue;
      filters[property] = [row.original[property]];
    }
  }
  const { data, loading, error } = useQuery(query, {
    variables: {
      widget,
      math: math,
      rowFilter: handleFilters(filters),
    },
  });
  const columns = useMemo(() => {
    const columns = [];
    for (const part of parts) {
      let Cell = ({ cell }) => cell.value;
      let Header = t(`kpisApp:dataTable.${part}`);
      if (part.indexOf("Date") >= 0)
        Cell = ({ cell }) => (
          <DateFormatter
            date={cell.value}
            className="block text-center"
          />
        );
      if (part.indexOf("MontantFacture") >= 0)
        Cell = ({ cell }) => (
          <MoneyFormatter
            data={cell.value}
            className="block text-right"
            digit={0}
          />
        );
      if (part.indexOf("NumeroDossier") >= 0)
        Cell = ({ cell }) => <FolderNumber id={cell.value} />;
      columns.push({
        Header,
        accessor: part,
        sortable: true,
        Cell,
      });
    }
    return columns;
  }, [t, parts]);
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: t("kpisApp:NumeroFacture"),
  //       accessor: "NumeroFacture",
  //       sortable: true,
  //       width: "20%",
  //     },
  //     {
  //       Header: t("kpisApp:NumeroDossier"),
  //       accessor: "NumeroDossier",
  //       sortable: true,
  //       width: "20%",
  //     },
  //     // {
  //     //   Header: t("cApp:client"),
  //     //   accessor: "customer",
  //     //   sortable: true,
  //     //   Cell: ({ cell: { value } }) => {
  //     //     if (!value) return null;
  //     //     return (
  //     //       <span className="font-bold">
  //     //         {value.NomClient || "--"}
  //     //       </span>
  //     //     );
  //     //   },
  //     // },

  //     // {
  //     //   Header: t("kpisApp:reviseur"),
  //     //   accessor: "reviser",
  //     //   sortable: true,
  //     // },
  //     // {
  //     //   Header: t("kpisApp:ratio"),
  //     //   accessor: "ratio",
  //     //   sortable: true,
  //     //   Cell: ({ cell: { value } }) => (
  //     //     <PercentFormatter data={value} />
  //     //   ),
  //     // },
  //     // {
  //     //   Header: t("kpisApp:MontantFacture"),
  //     //   accessor: "MontantFacture",
  //     //   sortable: true,
  //     //   width: "20%",
  //     //   Cell: ({ cell: { value } }) => (
  //     //     <MoneyFormatter
  //     //       data={value}
  //     //       className="block text-right"
  //     //       digit={0}
  //     //     />
  //     //   ),
  //     // },
  //   ],
  //   [t]
  // );
  if (error) return "Error";
  return (
    <EnhancedTable
      classesNames={classes.root}
      loading={loading}
      columns={columns}
      data={(!!data && data.kpi_widgets_data) || []}
      footer={true}
      selectable={false}
    />
  );
}
export default SubRow;
