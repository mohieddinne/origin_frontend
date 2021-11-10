import React, { useEffect } from "react";
import ReportListUI from "./ReportListUI";
import { useLazyQuery, gql } from "@apollo/client";

const query = gql`
  query report_TEC($date: String, $employee: String) {
    report_TEC(date: $date, employee: $employee) {
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
      redFlag
    }
  }
`;

function List({ date }) {
  const [load, { loading, data, error, refetch }] = useLazyQuery(
    query,
    {
      variables: { date },
    }
  );

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let list = [];
  if (data && data.report_TEC) {
    list = data.report_TEC;
  }

  return (
    <ReportListUI
      data={list}
      loading={loading}
      error={error}
      refetch={refetch}
    />
  );
}

export default List;
