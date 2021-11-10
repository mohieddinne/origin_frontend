import React from "react";
import DatailsListUI from "./DatailsListUI";
import { useQuery, gql } from "@apollo/client";
import { useLocation } from "react-router-dom";

const query = gql`
  query billableHoursDetails($responsible: String) {
    billableHoursDetails(responsible: $responsible) {
      id
      employeeName
      responsable
      date
      category
      activiteType
      folderId
      billableHours
      invoiceId
      invoiceDate
    }
  }
`;

function List() {
  const location = useLocation();
  const responsible = location?.state?.responsible || "";
  const { data, loading, error, refetch } = useQuery(query, {
    variables: { responsible: responsible },
  });
  let list = [];

  if (data && data.billableHoursDetails) {
    list = data.billableHoursDetails;
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

export default List;
