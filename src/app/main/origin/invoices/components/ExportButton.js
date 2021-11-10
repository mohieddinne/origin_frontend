import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { saveFile, b64toBlob } from "@catu/helpers/save-blob";
import { useTranslation } from "react-i18next";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import Button from "@material-ui/core/Button";
import { useApolloClient, gql } from "@apollo/client";
import { useSelector } from "react-redux";

const query = gql`
  query ExporttoExcelInvoice(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
  ) {
    ExporttoExcelInvoice(
      ids: $ids
      search: $search
      filters: $filters
    )
  }
`;

function Export() {
  const { t } = useTranslation();
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);

  const search = useSelector(
    ({ factureApp }) => factureApp.searchText
  );
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

  const fileName = t("fApp:list_of_invoices") + ".xlsx";

  const handleClick = async function () {
    try {
      setLoading(true);
      const { data } = await client.query({
        query,
        variables: { ids: [], search, filters },
      });
      const rawFile = data.ExporttoExcelInvoice;
      const blob = b64toBlob(rawFile, "text/xls");
      saveFile(blob, fileName);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title={t("Export_file")}>
        <span>
          <Button
            onClick={handleClick}
            className="mr-4"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress className="mx-4" size={20} />
            ) : (
              <SaveAltIcon />
            )}
          </Button>
        </span>
      </Tooltip>
    </>
  );
}

export default Export;
