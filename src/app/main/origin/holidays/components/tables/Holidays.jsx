import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import HolidaysUI from "./HolidaysUI";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const query = gql`
  query holidays($year: Int) {
    holidays(year: $year) {
      id
      name
      date
    }
  }
`;

function List() {
  const location = useLocation();
  const state = location.state || {};

  const year = useSelector(({ HolidaysApp }) => {
    return HolidaysApp.filters.year || null;
  });

  const { data, loading, error, refetch } = useQuery(query, {
    variables: { year },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (state.refetch) refetch();
  }, [refetch, state.refetch]);

  let holdidays = null;
  if (data && Array.isArray(data.holidays)) {
    holdidays = data.holidays;
  }

  return (
    <HolidaysUI
      loading={loading}
      data={holdidays}
      error={error}
      refetch={refetch}
    />
  );
}

export default List;
