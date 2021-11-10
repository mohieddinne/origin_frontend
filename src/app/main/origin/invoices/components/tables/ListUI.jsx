import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import Export from "../ExportButton";
import SimpleFilterHandler from "./filter/SimpleFilterHandler";
import SubRow from "./SubRow";
import FolderNumber from "../../../components/FolderNumber";
import ProjectInvoiceNumber from "../../../components/ProjectInvoiceNumber";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import AdvancedFiltersWrapper from "./advanced-filters/AdvancedFiltersWrapper";
import { ContextWrapper } from "./filter/FilterContext";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "7rem",
  },
}));

function List({ loading, error, refetch }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const data = useSelector(({ factureApp }) => factureApp.data);

  const columns = useMemo(
    () => [
      {
        Header: t("fApp:facture_number"),
        accessor: "NumeroFacture",
        sortable: true,
        width: "15%",
        sortMethod: (a, b) => Number(a) - Number(b),
        Cell: ({ cell }) => {
          if (cell.value.includes("Projet"))
            return (
              <ProjectInvoiceNumber
                invoiceId={cell.value}
                value={cell.value}
                folderId={cell.row.original.NumeroDossier}
              />
            );
          else return <>{cell.value}</>;
        },
      },
      {
        Header: t("fApp:folder_number"),
        accessor: "NumeroDossier",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell }) => <FolderNumber id={cell.value} />,
      },
      {
        Header: t("dApp:office"),
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ row: { original } }) => {
          return (
            <span className="font-bold">
              {original.folders ? original.folders.Bureau : "--"}
            </span>
          );
        },
      },
      {
        Header: t("fApp:date_facturation"),
        accessor: "DateFacturation",
        responsive: "hidden md:table-cell text-center",
        sortable: true,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("fApp:Montant_honoraires"),
        accessor: "MontantHonoraires",
        responsive: "hidden md:table-cell  text-right",
        sortable: true,
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },

      {
        Header: t("fApp:montant_depenses"),
        accessor: "MontantDepenses",
        responsive: "hidden md:table-cell text-right",
        sortable: true,
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },

      {
        Header: t("fApp:Montant_facture"),
        accessor: "MontantFacture",
        responsive: "hidden md:table-cell text-right",
        sortable: true,
        Cell: ({ cell }) => (
          <MoneyFormatter data={cell.value} digit={0} />
        ),
      },
    ],
    [t]
  );

  return (
    <ContextWrapper>
      <EnhancedTable
        data={data || []}
        columns={columns}
        error={error}
        loading={loading}
        title={t("fApp:list_of_invoices")}
        className={classes.root}
        calbacks={{ Filter: SimpleFilterHandler, Export }}
        options={{
          refetch,
          subRow: (row) => <SubRow row={row} />,
          special_filter: true,
          advanced_filter: true,
          subTitleComponemt: <AdvancedFiltersWrapper />,
        }}
      />
    </ContextWrapper>
  );
}

export default withRouter(List);
