import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { saveFile, b64toBlob } from "@catu/helpers/save-blob";
import { useTranslation } from "react-i18next";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import { useApolloClient, gql } from "@apollo/client";

const query = gql`
  query ExporttoExcelfolder(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
  ) {
    ExporttoExcelfolder(ids: $ids, search: $search, filters: $filters)
  }
`;

function ExportHandler() {
  const search = useSelector(({ folderApp }) => folderApp.searchText);
  const reduxFilter = useSelector(
    ({ folderApp }) => folderApp.filters
  );

  const filters = Object.keys(reduxFilter).map((key) => {
    const a = reduxFilter[key];
    const value = Array.isArray(a) ? a : [a];
    return {
      name: key,
      value,
    };
  });

  return <Export search={search} filters={filters} />;
}

function Export({ search, filters }) {
  const { t } = useTranslation();
  const client = useApolloClient();

  const [loading, setLoading] = useState(false);

  const fileName = t("dApp:list_of_folders") + ".xlsx";

  const handleClick = async function () {
    setLoading(true);
    const { data } = await client.query({
      query,
      variables: { ids: [], search, filters },
    });
    const rawFile = data.ExporttoExcelfolder;
    const blob = b64toBlob(rawFile, "text/xls");
    saveFile(blob, fileName);
    setLoading(false);
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

export default ExportHandler;
