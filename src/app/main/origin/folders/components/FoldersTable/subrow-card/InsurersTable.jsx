import React, { useMemo } from "react";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import { useTranslation } from "react-i18next";
import TextTrimer from "@catu/components/TextTrimer";
import ClientNumber from "../../../components/ClientNumber";

function InsurersTable({ item, loading }) {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "NumeroClient",
        sortable: true,
        width: "20%",
        Cell: ({ cell: { value } }) => {
          if (!value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return <ClientNumber id={value} />;
        },
      },
      {
        Header: t("dApp:insurer", { count: item.length }),
        accessor: "NomClient",
        width: "80%",
        sortable: true,
        Cell: ({ cell: { value }, row: { original } }) => {
          if (!value) {
            return (
              <span className="text-gray italic">
                {t("unspecified")}
              </span>
            );
          }
          return (
            <ClientNumber
              id={original.NumeroClient}
              component="div"
              value={<TextTrimer string={value} length={80} />}
            />
          );
        },
      },
    ],
    [t, item]
  );

  return (
    <EnhancedTable
      loading={loading}
      columns={columns}
      data={item}
      footer={true}
      selectable={false}
    />
  );
}
export default InsurersTable;
