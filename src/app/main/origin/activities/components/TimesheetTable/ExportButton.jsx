import { useState, useContext } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { saveFile, b64toBlob } from "@catu/helpers/save-blob";
import { useTranslation } from "react-i18next";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import Button from "@material-ui/core/Button";
import { useApolloClient, gql } from "@apollo/client";
import TimesheetContext from "./Context";

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
  const { filters, hasData } = useContext(TimesheetContext);

  return <Export hasData={hasData} filters={filters} />;
}

function Export({ hasData, filters }) {
  const { t } = useTranslation();
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);

  const fileName = t("activities:list_of_activities") + ".xlsx";

  const handleClick = async function () {
    try {
      setLoading(true);
      const { data } = await client.query({
        query,
        variables: { ids: [], search: "", filters },
      });

      const blob = b64toBlob(data.activityToFile, "text/xls");
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
            disabled={loading || !hasData}
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
