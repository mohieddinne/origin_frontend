import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import { useQuery, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as Actions from "../../store/action";
import FilterHandler from "../FilterHandler";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    marginTop: "7rem",
  },
}));

const query = gql`
  query ActivityLogsfolders($date: String) {
    ActivityLogs(date: $date) {
      id
      description
      userName
      userEmail

      createdAt
    }
  }
`;

function ListUI() {
  const dispatch = useDispatch();
  const date_filter = useSelector(
    ({ Activity_log_app }) => Activity_log_app.filters || []
  );
  const date_ = date_filter.activity_date;

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      date: date_,
    },
  });

  if (data && data.ActivityLogs) {
    dispatch(Actions.setActvity(data.ActivityLogs));
  }
  const [searchResults, setSearchResults] = useState([]);
  const keywords = useSelector(({ Activity_log_app }) =>
    Activity_log_app.searchText.toLowerCase()
  );
  const data_ = useSelector(
    ({ Activity_log_app }) => Activity_log_app.data || []
  );
  useEffect(() => {
    let filteredData;
    if (!keywords) filteredData = data_;
    else
      filteredData = data_.filter((item) => {
        const values = Object.values(item);
        const find = values.find((val) => {
          if (!val) return false;
          const value = val.toString().toLowerCase();
          return value.includes(keywords);
        });
        return find;
      });
    setSearchResults(filteredData);
  }, [data_, keywords]);

  const { t } = useTranslation();
  const classes = useStyles();

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
        sortable: true,
      },

      {
        Header: t("activity_log:description"),
        accessor: "description",
        className: "justify-center",
        sortable: true,
      },
      {
        Header: t("activity_log:userName"),
        accessor: "userName",
        className: "justify-center",

        sortable: true,
      },

      {
        Header: t("activity_log:courriel"),
        accessor: "userEmail",
        className: "justify-center",
        sortable: true,
      },

      {
        Header: t("activity_log:createdAt"),
        accessor: "createdAt",
        className: "text-center",
        sortable: true,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
    ],
    [t]
  );

  return (
    <EnhancedTable
      title={t("activity_log:log")}
      selectable={false}
      loading={loading}
      className={classes.root}
      columns={columns}
      data={searchResults || []}
      calbacks={{ Filter: FilterHandler }}
      error={error}
      options={{
        refetch: refetch,
        special_filter: true,
      }}
    />
  );
}

export default ListUI;
