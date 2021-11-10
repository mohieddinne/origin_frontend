import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SettingsIcon from "@material-ui/icons/Settings";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import SimpleFilterHandler from "./filter/SimpleFilterHandler";
import FolderNumber from "../../../components/FolderNumber";
import { ContextWrapper } from "./filter/FilterContext";
import AdvancedFiltersWrapper from "./advanced-filters/AdvancedFiltersWrapper";
import ExportButton from "./ExportButton";
import SubRow from "./subrow-card/";

function List({ loading, error, refetch }) {
  const { t } = useTranslation();
  const history = useHistory();

  const data = useSelector(({ folderApp }) => folderApp.data) || [];

  const columns = useMemo(
    () => [
      {
        Header: t("dApp:folder_number"),
        accessor: "NumeroDossier",
        sortable: true,
        width: "15%",
        Cell: ({ row, cell }) => (
          <FolderNumber
            id={row.original.NumeroDossier}
            value={cell.value}
          />
        ),
      },
      {
        Header: t("dApp:office"),
        accessor: "Bureau",
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
            <span className="text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap bg-blue">
              {cell.value}
            </span>
          );
        },
      },
      {
        Header: t("dApp:responsable"),
        accessor: "Responsable",
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
            <span
              style={{
                backgroundColor: "rgb(163 107 70)",
              }}
              className="text-white inline text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap "
            >
              {cell.value}
            </span>
          );
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
        Header: t("dApp:mandate_date"),
        accessor: "DateMandat",
        responsive: "hidden sm:table-cell",
        sortable: true,
        Cell: ({ cell }) => (
          <DateFormatter date={cell.value} className="text-center" />
        ),
      },
      {
        Header: t("dApp:TypeDePerte"),
        accessor: "TypeDePerte",
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
          return cell.value;
        },
      },
      {
        Header: t("dApp:type_of_building"),
        accessor: "TypeBatiment",
        responsive: "hidden lg:table-cell",
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
        Header: t("addresses.city"),
        accessor: "VillePerte",
        responsive: "hidden lg:table-cell",
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
        Header: "Action",
        Cell: ({ row }) => {
          return (
            <>
              <IconButton
                onClick={() => {
                  const url = `/app/folders/item/${row.original.NumeroDossier}`;
                  history.push(url);
                }}
              >
                <VisibilityIcon />
              </IconButton>
              {process.env.NODE_ENV !== "production" && (
                <IconButton
                  onClick={() => {
                    const url = `/app/folders/setting/${row.original.NumeroDossier}`;
                    history.push(url);
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              )}
            </>
          );
        },
      },
    ],
    [history, t]
  );

  return (
    <ContextWrapper>
      <EnhancedTable
        title={t("dApp:list_of_folders")}
        loading={loading}
        columns={columns}
        error={error}
        data={data}
        calbacks={{
          Filter: SimpleFilterHandler,
          Export: ExportButton,
        }}
        selectable={false}
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

export default List;
