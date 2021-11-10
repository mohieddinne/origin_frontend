import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import AsyncEnhancedTable from "@catu/components/Table/AsyncEnhancedTable";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import FolderNumber from "../../../components/FolderNumber";
import Export from "../ExportButton";
import SimplestateFilterHandler from "../tables/filter/SimplestateFilterHandler";
import ProjectInvoiceNumber from "../../../components/ProjectInvoiceNumber";
import AdvancedFiltersWrapper from "../tables/advanced-filters/AdvancedFiltersWrapper";
import { ContextWrapper } from "./filter/FilterContext";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    marginTop: "7rem",
  },
}));

function ListUI({
  data,
  loading,
  error,
  refetch,
  options,
  getActivities,
}) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [pageCount, setPageCount] = useState(0);

  const colorMatching = React.useMemo(() => {
    return [
      {
        color: "#C7EDE4",
        name: "Absence",
      },
      {
        color: "#D5FFF3",
        name: "Administration (non facturable)",
      },
      {
        color: "#AF9AB2",
        name: "Comptabilité",
      },
      {
        color: "#820B8A",
        name: "Déplacement",
      },
      {
        color: "#672A4E",
        name: "Expertise",
      },
      {
        color: "#7CFFCB",
        name: "Formation",
      },
      {
        color: "#74F2CE",
        name: "Infographie (Charger tarif secrétariat)",
      },
      {
        color: "#379634",
        name: "Laboratoire",
      },
      {
        color: "#0A3200",
        name: "Procès",
      },
      {
        color: "#947EB0",
        name: "Projet",
      },
      {
        color: "#222A68",
        name: "Promotion",
      },
      {
        color: "#654597",
        name: "Secrétariat",
      },
    ];
  }, []);

  const fetchData = ({ pageSize, pageIndex }) => {
    const pointer = pageIndex + 1;
    const totalCount = data?.totalCount || 0;
    // Set the page count
    setPageCount(Math.ceil(totalCount / pageSize));
    // Fetech the data
    getActivities({
      variables: {
        paging: { first: pageSize, pointer },
      },
    });
  };

  const columns = React.useMemo(() => {
    let columns = [
      {
        Header: t("activities:activity_number"),
        accessor: "id",
        sortable: true,
        width: "10%",
      },
      {
        Header: t("activities:employee_name"),
        accessor: "employeeName",
        className: "justify-center",
        width: "10%",
        sortable: true,
      },
      {
        Header: t("activities:folder_number"),
        accessor: "folderId",
        className: "justify-center",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => (
          <FolderNumber id={cell.value} value={cell.value} />
        ),
      },
      {
        Header: t("activities:activity"),
        accessor: "activiteType",
        className: "justify-center",
        sortable: true,
        width: "10%",
      },
      {
        Header: t("activities:category"),
        accessor: "category",
        className: "justify-center",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => {
          if (!cell.value)
            return (
              <span className="text-gray italic text-11 font-500 ">
                {t("not_defined")}
              </span>
            );
          let color = "blue";
          const foundColor = colorMatching.find(
            (el) => el.name === cell.value
          ).color;
          if (foundColor) {
            color = foundColor;
          }
          if (
            options &&
            Array.isArray(options.category_activity_color)
          ) {
            const item = options.category_activity_color.find(
              (element) => element.category === cell.value
            );
            if (item && item.color) {
              color = item.color;
            }
          }
          return (
            <span
              className={`text-white text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap`}
              style={{ backgroundColor: color }}
            >
              {cell.value}
            </span>
          );
        },
      },
      {
        Header: t("activities:activity_date"),
        accessor: "date",
        className: "justify-center",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("activities:hours"),
        accessor: "hours",
        sortable: true,
        width: "5%",
        Cell: ({ row, cell }) => {
          return <>{cell.value.toFixed(2)} </>;
        },
      },
      {
        Header: t("activities:invoiced_hours"),
        accessor: "billableHours",
        sortable: true,
        width: "10%",
        Cell: ({ row, cell }) => {
          return <>{cell.value.toFixed(2)} </>;
        },
      },
      {
        Header: t("activities:affected_invoice"),
        accessor: "invoiceId",
        className: "text-center",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => {
          if (cell?.value?.includes("Projet"))
            return (
              <ProjectInvoiceNumber
                invoiceId={cell.value}
                value={cell.value}
                folderId={cell.row.original.folderId}
              />
            );
          return <>{cell.value}</>;
        },
      },
      {
        Header: t("DateFacturation"),
        accessor: "invoiceDate",
        className: "text-center",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("activities:responsible"),
        accessor: "responsible",
        sortable: true,
        width: "10%",
      },
    ];
    return columns;
  }, [t, colorMatching, options]);

  return (
    <ContextWrapper>
      <AsyncEnhancedTable
        title={t("activities:list_of_activities")}
        selectable={false}
        loading={loading}
        className={classes.root}
        columns={columns}
        data={data?.nodes || []}
        error={error}
        calbacks={{ Filter: SimplestateFilterHandler, Export }}
        totalCount={data?.totalCount || 0}
        pageCount={pageCount}
        fetchData={fetchData}
        options={{
          refetch: refetch,
          special_filter: true,
          advanced_filter: true,
          subTitleComponemt: <AdvancedFiltersWrapper />,
        }}
      />
    </ContextWrapper>
  );
}

export default ListUI;
