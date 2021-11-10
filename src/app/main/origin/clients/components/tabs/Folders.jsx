import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import Filter from "../misc/Filter";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import FolderNumber from "../../../components/FolderNumber";
import ClosingDateTag from "../../../folders/components/ClosingDateTag";

function Folder() {
  const { t } = useTranslation();

  const loading = useSelector(
    ({ clientApp }) => clientApp.form.loading
  );
  const data = useSelector(
    ({ clientApp }) =>
      clientApp.form.data && clientApp.form.data.folders
  );

  const columns = React.useMemo(
    () => [
      {
        Header: t("cApp:NumeroDossier"),
        accessor: "NumeroDossier",
        sortable: true,
        responsive: "hidden lg:table-cell",
        width: "10%",
        Cell: ({ cell }) => <FolderNumber id={cell.value} />,
      },

      {
        Header: t("dApp:office"),
        accessor: "Bureau",
        responsive: "hidden lg:table-cell",
        sortable: true,
        Cell: ({ cell }) => (
          <span className="text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap bg-blue">
            {cell.value}
          </span>
        ),
      },
      {
        Header: t("dApp:responsable"),
        accessor: "Responsable",
        responsive: "hidden lg:table-cell",
        sortable: true,
        Cell: ({ cell }) => (
          <span className="text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap bg-green">
            {cell.value}
          </span>
        ),
      },

      {
        Header: t("dApp:mandate_date"),
        accessor: "DateMandat",
        responsive: "hidden lg:table-cell",
        sortable: true,
        Cell: ({ cell }) => <DateFormatter date={cell.value} />,
      },
      {
        Header: t("dApp:TypeDePerte"),
        accessor: "TypeDePerte",
        responsive: "hidden lg:table-cell",
        sortable: true,
      },

      {
        Header: t("dApp:type_of_building"),
        accessor: "TypeBatiment",
        responsive: "hidden lg:table-cell",
        sortable: true,
      },
      {
        Header: t("dApp:VillePerte"),
        accessor: "VillePerte",
        sortable: true,
        responsive: "hidden lg:table-cell",
      },
      {
        Header: t("dApp:Actif"),
        accessor: "DateFerme",
        sortable: true,
        responsive: "hidden lg:table-cell",
        Cell: ({ cell }) => <ClosingDateTag date={cell.value} />,
      },

      {
        Header: "Action",
        Cell: ({ row }) => (
          <Link to={`/app/folders/item/${row.values.NumeroDossier}`}>
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          </Link>
        ),
      },
    ],
    [t]
  );

  return (
    <EnhancedTable
      loading={loading}
      columns={columns}
      data={data || []}
      selectable={true}
      dense={true}
      Filter={Filter}
    />
  );
}

export default Folder;
