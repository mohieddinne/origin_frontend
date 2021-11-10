import React from "react";
import { useQuery, gql } from "@apollo/client";
import RangerUI from "./AmountRanger";

const query = gql`
  query {
    filtersinvoice(slugs: "amount") {
      name
      data {
        name
        value
      }
    }
  }
`;

function AmountHandler() {
  const { data, loading, error } = useQuery(query);
  if (error) return null;
  let min = 0,
    max = 100;
  if (
    data &&
    Array.isArray(data.filtersinvoice) &&
    data.filtersinvoice[0].data
  ) {
    const range = data.filtersinvoice[0].data;
    min = range.find((item) => item.name === "min").value || 0;
    max = range.find((item) => item.name === "max").value || 100;
  }
  return (
    <RangerUI
      min={parseInt(min)}
      max={parseInt(max)}
      disabled={loading}
    />
  );
}

export default AmountHandler;
