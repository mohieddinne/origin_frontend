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
  query activityToFile(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
  ) {
    activityToFile(ids: $ids, search: $search, filters: $filters)
  }
`;

function ExportHandler(props) {
  const search = useSelector(
    ({ activityApp }) => activityApp.searchText
  );
  const reduxFilter = useSelector(
    ({ activityApp }) => activityApp.filters
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

  const fileName = t("activities:list_of_activities") + ".xlsx";

  const tabLoading = useSelector(
    ({ activityApp }) => activityApp.form.loading
  );

  const handleClick = async function () {
    setLoading(true);
    const { data } = await client.query({
      query,
      variables: { ids: [], search, filters },
    });
    if (!data) return false;
    const rawFile = data.activityToFile;
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
            disabled={loading || tabLoading}
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
