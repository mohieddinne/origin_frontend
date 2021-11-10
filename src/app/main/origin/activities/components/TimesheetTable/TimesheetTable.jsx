import { useMemo, useContext, useEffect } from "react";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TimesheetFilter from "./Filters";
import Export from "./ExportButton";
import FolderNumber from "app/main/origin/components/FolderNumber";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import Datebox from "./DateBox";
import { useQuery, gql } from "@apollo/client";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import { isSameDay } from "@catu/helpers/dates.helpers";
import TextTrimer from "@catu/components/TextTrimer";
import TimesheetContext from "./Context";
import FuseUtils from "@fuse/FuseUtils";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

const query = gql`
  query activities(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
  ) {
    activities(ids: $ids, search: $search, filters: $filters) {
      totalCount
      pageInfo {
        hasNextPage
      }
      nodes {
        id
        ... on Activity {
          employeeName
          date
          folderId
          category
          activiteType
          responsible
          hours
          comment
          NombreHeuresFacturees
          hourlyRate
          billableHours
          language
        }
      }
    }
  }
`;

export default function TimesheetTable() {
  const { t } = useTranslation("activities");
  const history = useHistory();

  const { filters, setHasData, dates } = useContext(TimesheetContext);

  const {
    loading,
    data: response,
    error,
    refetch,
  } = useQuery(query, {
    variables: { filters },
    fetchPolicy: "no-cache",
    skip: filters.length < 2,
  });

  const activities = useMemo(() => {
    let activities = response?.activities?.nodes || [];
    // Apply local filters
    if (Array.isArray(dates) && dates.length > 0) {
      activities = activities.filter((item) => {
        const isFound = !!dates.find((date) => {
          const itemDate = new Date(parseInt(item.date));
          return isSameDay(date, itemDate);
        });
        return isFound;
      });
    }
    return activities;
  }, [response?.activities?.nodes, dates]);

  useEffect(() => {
    let activities = response?.activities?.nodes || [];
    setHasData(activities.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response?.activities?.nodes]);

  const haEditActivities = FuseUtils.hasPermission({
    slug: "activities",
    permission: "can_edit",
  });

  const columns = useMemo(() => {
    const cols = [
      {
        Header: t("translation:calendar.date"),
        accessor: "date",
        sortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("translation:unspecified")}
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
        Header: t("timesheet-view.folder"),
        accessor: "folderId",
        sortable: true,
        Cell: ({ cell }) => {
          if (cell.value) {
            return (
              <FolderNumber id={cell.value} value={cell.value} />
            );
          }
          return (
            <span className="text-gray italic">
              {t("translation:none")}
            </span>
          );
        },
      },
      {
        Header: t("translation:category"),
        accessor: "category",
        sortable: true,
        responsive: "hidden sm:table-cell",
      },

      {
        Header: t("activity"),
        accessor: "activiteType",
        responsive: "hidden md:table-cell",
        Cell: ({ cell: { value } }) => (
          <TextTrimer string={value} length={20} />
        ),
      },

      {
        Header: t("hours"),
        accessor: "hours",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ row, cell }) => {
          return <>{cell.value.toFixed(2)} </>;
        },
      },
      {
        Header: t("timesheet-view.facturation-hour"),
        accessor: "billableHours",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ row, cell }) => {
          return <>{cell.value.toFixed(2)} </>;
        },
      },

      {
        Header: t("form.rate"),
        accessor: "hourlyRate",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },
      {
        Header: t("form.comment"),
        accessor: "comment",
        responsive: "p-0 hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell: { value } }) => (
          <TextTrimer string={value} length={30} />
        ),
      },
    ];
    if (haEditActivities) {
      cols.push({
        Header: t("translation:action", { count: 1 }),
        sortable: false,
        width: "10%",
        Cell: ({ row: { original } }) => {
          return (
            <>
              <IconButton
                onClick={() => {
                  const url = `/app/activities/item/${original.id}`;
                  history.push(url);
                }}
              >
                <EditIcon />
              </IconButton>
            </>
          );
        },
      });
    }
    return cols;
  }, [haEditActivities, history, t]);

  return (
    <>
      <EnhancedTable
        title={t("timsheet")}
        classesNames="h-auto"
        selectable={false}
        columns={columns}
        loading={loading}
        error={error}
        data={activities}
        calbacks={{ Export }}
        options={{
          subTitleComponemt: <TimesheetFilter />,
          refetch: refetch,
          special_filter: true,
          cellPadding: "p-8",
          rowProps: (row, props) => {
            let className = "";
            if (row.original.language === "Anglais") {
              className = "bg-gray-200";
            }
            return { ...props, className };
          },
        }}
      />
      <Datebox data={response?.activities?.nodes || []} />
    </>
  );
}
