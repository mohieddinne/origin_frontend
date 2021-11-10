import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import FolderNumber from "../../../components/FolderNumber";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    marginTop: "7rem",
  },
}));

function ListUI({ data, loading, error, refetch }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const columns = React.useMemo(
    () => [
      {
        Header: t("activities:activity_number"),
        accessor: "id",
        sortable: true,
        width: "10%",
      },
      {
        Header: t("activities:folder_number"),
        accessor: "folderId",
        className: "justify-center",
        sortable: false,
        width: "10%",
        Cell: ({ cell }) => (
          <FolderNumber id={cell.value} value={cell.value} />
        ),
      },
      {
        Header: t("activities:hours"),
        accessor: "hours",
        sortable: true,
      },
      {
        Header: t("NomEmploye"),
        accessor: "employeeName",
        className: "justify-center",
        width: "15%",
        sortable: true,
      },

      {
        Header: t("DateActivite"),
        accessor: "date",
        className: "justify-center",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("activities:category"),
        accessor: "category",
        className: "justify-center",
        sortable: true,
        width: "15%",
      },
      {
        Header: t("Activite"),
        accessor: "activiteType",
        className: "justify-center",
        sortable: false,
        width: "15%",
      },
      {
        Header: t("activities:billable_hours"),
        accessor: "billableHours",
        className: "text-right",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => (
          <MoneyFormatter
            data={cell.value}
            number={true}
            noWarp={true}
            digit={0}
          />
        ),
      },
      {
        Header: t("FactureAffecte"),
        accessor: "invoiceId",
        className: "text-center",
        sortable: true,
        width: "10%",
      },
      {
        Header: t("DateFacturation"),
        accessor: "invoiceDate",
        className: "text-center",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
    ],
    [t]
  );

  return (
    <EnhancedTable
      title={t("activities:list_hours_billable")}
      selectable={false}
      loading={loading}
      className={classes.root}
      columns={columns}
      data={data}
      error={error}
      options={{
        refetch: refetch,
        special_filter: true,
      }}
    />
  );
}

export default ListUI;
