import React, { useEffect } from "react";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import FolderNumber from "../../../components/FolderNumber";
import ReportsFilters from "./ReportsFilters";
import TextTrimer from "@catu/components/TextTrimer";
import WidgetIndicator from "./WidgetIndicator";
import { useSelector, useDispatch } from "react-redux";
import * as Action from "../../../kpis/store/actions";
import { useLocation } from "react-router-dom";
import FuseUtils from "@fuse/FuseUtils";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  root: {
    marginTop: "7rem",
  },
}));

const query = gql`
  query report_TEC($employees: [String], $projectNumber: ID) {
    report_TEC(employees: $employees, projectNumber: $projectNumber) {
      employee
      folderId
      nextActivityDate
      lastActivityDate
      mandateDate
      deliveryDate
      refrence
      invoiceAmount
      budget
      specimen
      stats
      totalAmount
      toComplete
      stats
      redFlag
    }
  }
`;

function HandlerTEC() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth?.user?.data);

  const hasAccessAllReport = FuseUtils.hasPermission({
    slug: "reports-tec",
    permission: "can_view",
  });

  const hasAccessOwnReport = FuseUtils.hasPermission({
    slug: "reports-tec",
    permission: "can_view_own",
  });

  const employees = [];
  if (location?.state?.employee) {
    employees.push(location?.state?.employee);
  } else if (hasAccessAllReport) {
    employees.push("every_user");
  } else if (hasAccessOwnReport) {
    employees.push(user.NomEmploye);
  }

  useEffect(() => {
    if (employees?.length !== 0)
      dispatch(Action.setReportFilter({ Responsable: employees }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees]);

  const { loading, data, error } = useQuery(query, {
    variables: { employees },
    skip: employees?.length === 0,
  });

  if (!user) return null;

  return (
    <ListTEC
      qData={{ loading, data, error }}
      isExpert={!hasAccessAllReport && hasAccessOwnReport}
      fullName={user.NomEmploye}
    />
  );
}

function ListTEC({ qData, fullName, isExpert }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [get, { loading, data, error }] = useLazyQuery(query);

  const columns = React.useMemo(
    () => [
      {
        Header: t("Reports:folderId"),
        accessor: "folderId",
        className: "justify-center",
        sortable: false,
        responsive: "hidden sm:table-cell",
        Cell: ({ cell }) => (
          <FolderNumber id={cell.value} value={cell.value} />
        ),
      },
      {
        Header: t("Reports:reference"),
        accessor: "refrence",
        className: "justify-center",
        sortable: false,
        responsive: "hidden sm:table-cell",
        Cell: ({ cell }) => (
          <TextTrimer string={cell.value} length={15} />
        ),
      },
      {
        Header: t("Reports:Livraison"),
        accessor: "deliveryDate",
        className: "justify-center",
        responsive: "hidden sm:table-cell",
        sortable: false,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("Reports:DernierDeDateActivite"),
        accessor: "lastActivityDate",
        className: "justify-center",
        responsive: "hidden sm:table-cell",
        sortable: false,
        Cell: ({ cell, row }) => {
          const lastActivityDate = new Date(parseInt(cell.value));
          const today = new Date();
          const msInDay = 1000 * 60 * 60 * 24;
          const diffDays = parseInt(
            (today - lastActivityDate) / msInDay,
            10
          );

          let diffDaysMandate = 0;
          const mandateDate = row?.original?.mandateDate;
          if (mandateDate) {
            const mandateDateInt = new Date(
              parseInt(row?.original?.mandateDate)
            );
            diffDaysMandate = parseInt(
              (today - mandateDateInt) / msInDay,
              10
            );
          }

          let bg = "bg-green";
          if (diffDays > 42) {
            bg = "bg-red";
          } else if (diffDays > 14 || diffDaysMandate > 28) {
            bg = "bg-yellow";
          }

          return (
            <span
              className={
                "text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap " +
                bg
              }
            >
              <DateFormatter date={cell.value} />
            </span>
          );
        },
      },
      {
        Header: t("Reports:DateProchaineActivite"),
        accessor: "nextActivityDate",
        className: "justify-center",
        responsive: "hidden sm:table-cell",
        sortable: false,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("Reports:budget"),
        accessor: "budget",
        className: "text-right",
        responsive: "hidden sm:table-cell",
        sortable: false,
        Cell: ({ cell, row }) => {
          let bg = "bg-white";
          let diff = 1;
          if (cell.value > 0 && row?.original?.totalAmount) {
            diff = row.original.totalAmount / cell.value;
          }
          if (diff > 0.8) {
            bg = "text-white bg-red";
          }
          return (
            <span
              className={
                "px-8 py-4 rounded-4 whitespace-nowrap " + bg
              }
            >
              <MoneyFormatter data={cell.value} />
            </span>
          );
        },
      },
      {
        Header: t("Reports:invoiceAmount"),
        accessor: "invoiceAmount",
        className: "text-right",
        responsive: "hidden sm:table-cell",
        sortable: false,
        Cell: ({ cell }) => (
          <MoneyFormatter data={Math.round(cell.value)} digit={0} />
        ),
      },
      {
        Header: t("Reports:totalAmount"),
        accessor: "totalAmount",
        className: "text-right",
        sortable: false,
        responsive: "hidden sm:table-cell",
        Cell: ({ cell }) => (
          <MoneyFormatter data={Math.round(cell.value)} digit={0} />
        ),
      },
      {
        Header: t("Reports:toComplete"),
        accessor: "toComplete",
        className: "text-center",
        sortable: false,
        responsive: "hidden sm:table-cell",

        Cell: ({ cell }) => (
          <MoneyFormatter data={Math.round(cell.value)} digit={0} />
        ),
      },
      {
        Header: t("Reports:Specimen"),
        accessor: "specimen",
        className: "justify-center text-center",
        responsive: "hidden sm:table-cell",
        sortable: false,
      },
      {
        Header: t("Reports:stats"),
        accessor: "stats",
        className: "justify-center text-center",
        responsive: "hidden sm:table-cell",
        sortable: false,
        Cell: ({ cell }) => {
          if (cell.value === true) {
            return (
              <span className="text-gray-800 italic ">
                {t("true")}
              </span>
            );
          }
          return (
            <span className="text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap bg-red">
              {t("false")}
            </span>
          );
        },
      },
    ],
    [t]
  );

  const handleSubmit = (data) => {
    dispatch(Action.setReportFilter(data));
    const employees = data.Responsable || [];
    const projectNumber = data.projectNumber;
    get({
      variables: { employees, projectNumber },
      skip: !employees,
    });
  };

  return (
    <EnhancedTable
      title={t("Reports:list_of_reports")}
      selectable={false}
      loading={qData.loading || loading}
      className={classes.root}
      columns={columns}
      data={(data || qData.data)?.report_TEC || []}
      error={qData.error || error}
      options={{
        subTitleComponemt: (
          <>
            <ReportsFilters
              handlers={handleSubmit}
              defaultUser={isExpert ? fullName : null}
            />
            <WidgetIndicator
              list={(data || qData.data)?.report_TEC || []}
              loading={qData.loading || loading}
            />
          </>
        ),
        special_filter: true,
      }}
    />
  );
}

export default React.memo(HandlerTEC);
