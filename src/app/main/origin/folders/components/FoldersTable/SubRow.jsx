import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useTranslation } from "react-i18next";
import TextTrimer from "@catu/components/TextTrimer";
import { useQuery, gql } from "@apollo/client";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const query = gql`
  query folders($ids: [ID]) {
    folders(ids: $ids) {
      NumeroDossier
      Reference
      Responsable
      VillePerte
      NomAssure
      DateLivraison
      DatePerte
      DateFerme
      RecuPar
      Budget
      clients {
        NumeroClient
        Inactif
        NomClient
        TypeClient
        Adresse
        Ville
        CodePostal
        Courriel
        TelBureau
        TelFax
        TelCellulaire
        TelDomicile
        TelAutre
        SiteWeb
        Langue
        Commentaires
        Directives
      }
    }
  }
`;

const useStyles = makeStyles({
  root: {
    background: "#f4f4f4",
  },
});

function SubRow({ row }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { data, loading, error } = useQuery(query, {
    variables: {
      ids: [row.original.NumeroDossier],
    },
  });

  const rows = data && data.folders ? data.folders : [];
  const columnsclient = useMemo(
    () => [
      {
        Header: t("dApp:clients"),
        accessor: "clients",

        sortable: true,
        Cell: ({ cell: { value } }) => {
          if (!Array.isArray(value) || value.length === 0) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          const client = value[0];
          return (
            <span className="font-bold">
              {client.NomClient || "--"}
            </span>
          );
        },
      },
    ],
    [t]
  );
  const columnsAsurreur = useMemo(
    () => [
      {
        Header: t("dApp:Insurers"),
        accessor: "NomAssure",

        sortable: true,

        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return <TextTrimer string={cell.value} length="45" />;
        },
      },
    ],
    [t]
  );
  const columns = useMemo(
    () => [
      {
        Header: t("dApp:responsable"),
        accessor: "Responsable",
        responsive: "hidden sm:table-cell",

        sortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return (
            <span className="text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap bg-green">
              {cell.value}
            </span>
          );
        },
      },

      {
        Header: t("dApp:DateFerme"),
        accessor: "DateFerme",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
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
        Header: t("dApp:DatePerte"),
        accessor: "DatePerte",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
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
        Header: t("dApp:DateLivraison"),
        accessor: "DateLivraison",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
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
        Header: t("dApp:Budget"),
        accessor: "Budget",
        responsive: "hidden md:table-cell",
        sortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return cell.value;
        },
      },
      {
        Header: t("dApp:RecuPar"),
        accessor: "RecuPar",
        responsive: "hidden md:table-cell",
        sortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return cell.value;
        },
      },

      {
        Header: t("dApp:reference"),
        accessor: "Reference",
        sortable: true,
        responsive: "hidden sm:table-cell",

        Cell: ({ cell }) => (
          <TextTrimer string={cell.value} length="45" />
        ),
      },
    ],
    [t]
  );

  if (error) return "Error";

  return (
    <div className={classes.root}>
      <EnhancedTable
        classesNames={classes.root}
        loading={loading}
        columns={columns}
        data={rows}
        footer={true}
        selectable={false}
      />
      <div
        className="flex sm:flex-wrap md:flex-wrap xl:flex-nowrap 
       lg:flex-nowrap -mx-2 mb-8"
      >
        <div className="w-full sm:w-1/2  md:w-1/2 lg:w-1/2 xl:w-1/2 px-2 mb-4  ">
          <EnhancedTable
            classesNames={classes.root}
            loading={loading}
            columns={columnsclient}
            data={rows}
            footer={true}
            selectable={false}
          />
        </div>
        <div className="w-full sm:w-1/2   md:w-1/3 lg:w-1/2   xl:w-1/2  px-2 mb-4 ">
          <EnhancedTable
            classesNames={classes.root}
            loading={loading}
            columns={columnsAsurreur}
            data={rows}
            footer={true}
            selectable={false}
          />
        </div>
      </div>
      <Button
        variant="outlined"
        className="bg-gray-600 pb-8"
        onClick={() => {
          history.push(`/app/folders/item/${rows.NumeroDossier}`);
        }}
      >
        {t("dApp:see_folder_details")}
      </Button>
    </div>
  );
}
export default SubRow;
