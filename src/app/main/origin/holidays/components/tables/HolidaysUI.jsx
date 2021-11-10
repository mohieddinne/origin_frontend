import React, { useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useTranslation } from "react-i18next";
import ViewButton from "../buttons/ViewButton";
import DeleteButton from "../buttons/DeleteButton";
import FilterHandler from "./FilterHandler";
import DateFormatter from "@catu/components/formatters/DateFormatter";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "7rem",
  },
}));

function List({ loading, error, refetch, data }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [searchResults, setSearchResults] = useState([]);

  const keywords = useSelector(({ HolidaysApp }) => {
    const searchText = HolidaysApp.searchText.toLowerCase();
    return replaceSpecialChars(searchText);
  });

  useEffect(() => {
    let filteredData = [];
    if (Array.isArray(data)) {
      if (!keywords) filteredData = data;
      else
        filteredData = data.filter((item) => {
          const values = Object.values(item);
          const find = values.find((val) => {
            if (!val) return false;
            const value = replaceSpecialChars(val.toString());
            return value.toLowerCase().includes(keywords);
          });
          return find;
        });
    }
    setSearchResults(filteredData);
  }, [data, keywords]);

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
        sortable: true,
        width: "10%",
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
        Header: t("calendar.date"),
        accessor: "date",
        sortable: true,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("option"),
        id: "action",
        className: "justify-center",
        width: "20%",
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            <ViewButton item={row.original} />
            <DeleteButton id={row.original.id} callback={refetch} />
          </div>
        ),
      },
    ],
    [refetch, t]
  );

  return (
    <EnhancedTable
      title={t("holidays:list_of_holidays")}
      data={searchResults}
      columns={columns}
      error={error}
      loading={loading}
      className={classes.root}
      footer={false}
      calbacks={{ Filter: FilterHandler }}
      options={{
        selectable: false,
        refetch,
        special_filter: true,
      }}
    />
  );
}

function replaceSpecialChars(string) {
  return string
    .replace(/[ÀÁÂÃÄÅ]/, "A")
    .replace(/[àáâãäå]/, "a")
    .replace(/[ÈÉÊË]/, "E")
    .replace(/[Ç]/, "C")
    .replace(/[ç]/, "c");
}

export default List;
