import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import FolderNumber from "../../../components/FolderNumber";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    marginTop: "7rem",
  },
}));

const query = gql`
  query checkBillableHoursActiveDetails(
    $responsible: String
    $year: String
    $type: Int
  ) {
    checkBillableHoursActiveDetails(
      responsible: $responsible
      year: $year
      type: $type
    ) {
      date
      folderId
      employeeName
      activiteType
      invoiceDate
      invoiceId
      NombreHeuresFacturees
      responsable
    }
  }
`;

function BillableDetailsList() {
  const location = useLocation();
  const responsible = location?.state?.responsible || "";
  const year = location?.state?.year || "";
  const type = location?.state?.type || "";

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      responsible: responsible,
      year,
      type: parseInt(type),
    },
  });

  let list = [];

  if (data && data.checkBillableHoursActiveDetails) {
    list = data.checkBillableHoursActiveDetails;
  }

  return (
    <DatailsListUI
      data={list}
      loading={loading}
      error={error}
      refetch={refetch}
    />
  );
}

function DatailsListUI({ data, loading, error, refetch }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [count, setCount] = React.useState(null);

  React.useEffect(() => {
    const c = data.reduce(
      (count, current) => count + current.NombreHeuresFacturees,
      0
    );
    setCount(c.toFixed(2));
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: t("DateActivite"),
        accessor: "date",
        className: "justify-center",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
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
        Header: t("NomEmploye"),
        accessor: "employeeName",
        className: "justify-center",
        width: "15%",
        sortable: true,
      },
      {
        Header: t("activities:responsible"),
        accessor: "responsable",
        className: "justify-center",
        width: "15%",
        sortable: true,
      },
      {
        Header: t("Activite"),
        accessor: "activiteType",
        className: "justify-center",
        sortable: false,
        width: "15%",
      },
      {
        Header: "Heures non facturées",
        accessor: "NombreHeuresFacturees",
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
    ],
    [t]
  );

  return (
    <EnhancedTable
      title={
        "Heures non facturées" +
        (count ? " (total: " + count + ")" : "")
      }
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

export default BillableDetailsList;
