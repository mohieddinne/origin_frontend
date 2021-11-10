import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import Header from "../header/Header";
import TextTrimer from "@catu/components/TextTrimer";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import DeleteButton from "../buttons/DeleteButton";
import BulkDeleteButton from "../buttons/BulkDeleteButton";
import Footer from "../footer/Footer";
import DataContext from "./DataContext";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    marginTop: "7rem",
  },
}));

function ListUI() {
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const { loading, data: list } = useContext(DataContext);

  const [checked, setChecked] = React.useState(false);

  const handleEditClick = React.useCallback(
    (item) => {
      history.push({
        pathname: `/app/activities/item/${item.id}`,
        state: { item },
      });
    },
    [history]
  );

  const columns = React.useMemo(() => {
    let columns = [
      {
        Header: t("projectInvoice:date"),
        accessor: "date",
        sortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return (
            <DateFormatter
              date={cell.value}
              className="text-center"
            />
          );
        },
      },
      {
        Header: t("projectInvoice:employeeName"),
        accessor: "employeeName",
        sortable: true,
        // width: "40%",
      },
      {
        Header: t("projectInvoice:category"),
        accessor: "category",
        sortable: true,
        responsive: "hidden sm:table-cell",
      },

      {
        Header: t("projectInvoice:activity"),
        accessor: "activiteType",
        responsive: "hidden md:table-cell",
        sortable: true,
      },

      {
        Header: t("projectInvoice:hour"),
        accessor: "hours",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ row, cell }) => {
          return <>{cell.value.toFixed(2)} </>;
        },
      },
      {
        Header: t("projectInvoice:facturation-hour"),
        accessor: "billableHours",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ row, cell }) => {
          return <>{cell.value.toFixed(2)} </>;
        },
      },

      {
        Header: t("projectInvoice:rate"),
        accessor: "hourlyRate",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },
      {
        Header: t("projectInvoice:costs"),
        accessor: "Frais",
        responsive: "hidden sm:table-cell",
        sortable: true,
      },
      {
        Header: t("projectInvoice:comment"),
        accessor: "comment",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell: { value }, row: { original } }) => {
          if (!value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return <TextTrimer string={value} length={40} />;
        },
      },
      {
        Header: t("gApp:options"),
        id: "action",
        className: "justify-center",
        sortable: false,
        Cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center">
              <Tooltip title={t("button.edit")}>
                <IconButton
                  onClick={() => {
                    handleEditClick(item);
                  }}
                >
                  <Icon>edit</Icon>
                </IconButton>
              </Tooltip>

              <DeleteButton id={row.original.id} />
            </div>
          );
        },
      },
    ];
    return columns;
  }, [handleEditClick, t]);

  return (
    <EnhancedTable
      title={t("projectInvoice:list_of_ProjectInvoice")}
      selectable={true}
      className={classes.root}
      columns={columns}
      loading={loading}
      data={list || []}
      options={{
        subTitleComponemt: (
          <Header checked={checked} setChecked={setChecked} />
        ),
        bulkActions: [BulkDeleteButton],
        special_filter: true,
        FooterComponemt: <Footer checked={checked} list={list} />,
      }}
    />
  );
}

export default ListUI;
