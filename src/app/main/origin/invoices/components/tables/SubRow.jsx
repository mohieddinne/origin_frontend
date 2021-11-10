import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import PercentFormatter from "@catu/components/formatters/PercentFormatter";
import { useQuery, gql } from "@apollo/client";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useSelector } from "react-redux";
import clsx from "clsx";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import Error from "@catu/components/Error";
import ClientNumber from "../../../components/ClientNumber";
import TextTrimer from "@catu/components/TextTrimer";

const useStyles = makeStyles({
  root: {
    background: "#f4f4f4",
  },
});

const query = gql`
  query factures(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
    $splited: Boolean
  ) {
    factures(
      ids: $ids
      search: $search
      filters: $filters
      splited: $splited
    ) {
      NumeroFacture
      NumeroDossier
      DateFacturation
      MontantHonoraires
      MontantAdm
      MontantDepenses
      MontantFacture
      folders {
        Bureau
      }
      ratio
      reviser
      customer {
        NomClient
        NumeroClient
      }
    }
  }
`;

export default function SubRow({ row }) {
  const search = "";
  const splited = true;
  const reduxFilter = useSelector(
    ({ factureApp }) => factureApp.filters
  );
  const filters = Object.keys(reduxFilter).map((key) => {
    const a = reduxFilter[key];
    const value = Array.isArray(a) ? a : [a];
    return {
      name: key,
      value,
    };
  });
  const { t } = useTranslation();
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      ids: [row.original.NumeroFacture],
      search,
      filters,
      splited,
    },
  });

  let invoices = [];
  if (data && Array.isArray(data.factures)) {
    invoices = data.factures;
  }

  const columns = useMemo(
    () => [
      {
        Header: t("fApp:facture_number"),
        accessor: "NumeroFacture",
        sortable: true,
        width: "10%",
        sortMethod: (a, b) => Number(a) - Number(b),
      },
      {
        Header: t("fApp:client", { count: invoices.length }),
        accessor: "customer",
        sortable: true,
        width: "30%",
        Cell: ({ cell: { value } }) => {
          if (!value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return (
            <ClientNumber
              id={value.NumeroClient}
              value={
                <TextTrimer string={value.NomClient} length={40} />
              }
            />
          );
        },
      },
      {
        Header: t("fApp:Montant_honoraires"),
        accessor: "MontantHonoraires",
        sortable: true,
        responsive: "hidden md:table-cell text-right",
        width: "15%",
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },

      {
        Header: t("fApp:montant_depenses"),
        accessor: "MontantDepenses",
        sortable: true,
        responsive: "hidden md:table-cell text-right",
        width: "15%",
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },
      {
        Header: t("fApp:Montant_facture"),
        accessor: "MontantFacture",
        responsive: "hidden md:table-cell text-right",
        sortable: true,
        width: "10%",
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },
      {
        Header: t("kpisApp:ratio"),
        accessor: "ratio",
        responsive: "text-right",
        width: "10%",
        sortable: true,
        Cell: ({ cell }) => <PercentFormatter data={cell.value} />,
      },
    ],
    [invoices.length, t]
  );

  if (error) return <Error retry={refetch} />;

  return (
    <div
      className={clsx(
        classes.root,
        "rounded-8 mb-16 flex flex-wrap overflow-hidden"
      )}
    >
      <EnhancedTable
        loading={loading}
        columns={columns}
        data={invoices}
        footer={true}
        options={{
          refetch,
          selectable: false,
        }}
      />
    </div>
  );
}
