import React from "react";
import InvoiceProjectTable from "./InvoiceProjectTable";
import { DataProvider } from "./DataContext";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";

const query = gql`
  query activities(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
    $paging: PagingOptions
  ) {
    activities(
      ids: $ids
      search: $search
      filters: $filters
      pagination: $paging
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        ... on Activity {
          date
          folderId
          employeeName
          category
          activiteType
          billableHours
          invoiceId
          invoiceDate
          yearAct
          nbrOfBillableHours
          projectInvoice
          responsible
          hours
          hourlyRate
          comment
        }
      }
    }
    options(
      slugs: ["category_activity_color", "dbrd_wgt5_prctg_color"]
    ) {
      name
      value
    }
  }
`;

function InvoiceProjectContainer(props) {
  const { folderId } = useParams();
  const filterfolderId = {
    name: "folder_id",
    value: folderId,
  };
  const { loading, data, error, refetch } = useQuery(query, {
    variables: {
      filters: [filterfolderId],
      paging: { first: 50, pointer: 0 },
    },
    fetchPolicy: "no-cache",
  });
  const list = data?.activities?.nodes;
  const options = {};
  if (data?.options) {
    (data.options || []).forEach(({ name, value }) => {
      try {
        options[name] = JSON.parse(value);
      } catch {
        options[name] = value;
      }
    });
  }

  return (
    <DataProvider value={{ loading, data: list, error, refetch }}>
      <InvoiceProjectTable {...props} />
    </DataProvider>
  );
}
export default InvoiceProjectContainer;
