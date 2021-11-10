import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useTranslation } from "react-i18next";
import ViewButton from "../buttons/ViewButton";
import DeleteButton from "../buttons/DeleteButton";
import SwitchFavorite from "../buttons/SwitchFavorite";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    marginTop: "7rem",
  },
}));

function List({ loading }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState([]);

  const keywords = useSelector(({ ClientsGroupsApp }) =>
    ClientsGroupsApp.searchText.toLowerCase()
  );
  const data = useSelector(
    ({ ClientsGroupsApp }) => ClientsGroupsApp.data || []
  );
  useEffect(() => {
    let filteredData;
    if (!keywords) filteredData = data;
    else
      filteredData = data.filter((item) => {
        const values = Object.values(item);
        const find = values.find((val) => {
          if (!val) return false;
          const value = val.toString().toLowerCase();
          return value.includes(keywords);
        });
        return find;
      });
    setSearchResults(filteredData);
  }, [data, keywords]);

  const columns = useMemo(
    () => [
      {
        Header: t("gApp:groupId"),
        accessor: "id",
        sortable: true,
        width: "15%",
        headersClasses: "text-center",
        sortMethod: (a, b) => Number(a) - Number(b),
        Cell: ({ cell }) => (
          <div className="text-center">{cell.value}</div>
        ),
      },
      {
        Header: t("name"),
        accessor: "name",
        sortable: true,
        Cell: ({ cell: { value } }) => {
          return <span className="font-bold">{value}</span>;
        },
      },

      {
        Header: t("color"),
        accessor: "color",
        sortable: true,
        Cell: ({ cell }) => {
          const color = cell.value;
          return (
            <span
              style={{ background: color }}
              className="text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap"
            >
              {cell.value}
            </span>
          );
        },
      },
      {
        Header: t("gApp:client_count"),
        accessor: "clientCount",
        sortable: true,
        Cell: ({ cell: { value } }) => {
          return (
            <span className="font-bold">{value ? value : 0}</span>
          );
        },
      },
      {
        Header: t("gApp:favorite"),
        accessor: "favorite",
        sortable: true,
        Cell: ({ row }) => {
          return <SwitchFavorite item={row.original} />;
        },
      },
      {
        Header: t("gApp:options"),
        id: "action",
        className: "justify-center",
        width: "20%",
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <ViewButton item={row.original} />
            <DeleteButton
              id={row.original.id}
              count={row.original.clientCount}
              active={!row.original.fallback}
            />
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <EnhancedTable
      loading={loading}
      className={classes.root}
      columns={columns}
      data={searchResults}
      selectable={false}
      footer={false}
    />
  );
}

export default List;
