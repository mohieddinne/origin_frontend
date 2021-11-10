import { useContext } from "react";
import { useDispatch } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
// import * as Actions from "../../store/action";
import * as MainActions from "app/store/actions";
import { useMutation, gql } from "@apollo/client";
import DataContext from "../tables/DataContext";

const gQl = gql`
  mutation activityAction(
    $data: [ActivityInput]!
    $operation: String
  ) {
    activityAction(data: $data, operation: $operation)
  }
`;

function BulkDeleteButton({ selectedIndexes }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { data } = useContext(DataContext);
  const activities = selectedIndexes.map((index) => ({
    ID: data && data[index]?.id,
  }));
  console.log({ activities, data });

  const [exec, { refetch, loading }] = useMutation(gQl);

  const handleClose = () => dispatch(MainActions.closeDialog());
  const handleDelete = () => {
    exec({
      variables: {
        data: activities,
        operation: "delete",
      },
    })
      .then(() => {
        handleClose();
        refetch();
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") console.log(err);
      });
    handleClose();
  };

  const handleClick = () => {
    const dialog = {
      title: t("projectInvoice:you_are_deleting_activity"),
      maxWidth: "sm",
      content: (
        <Typography className="flex flex-col">
          <span className="text-gray-900 text-center  px-4 py-2 m-2">
            {t("projectInvoice:you_are_deleting_activity_Ques")}{" "}
          </span>
        </Typography>
      ),
      actions: [
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          disableElevation
          autoFocus
          disabled={loading}
        >
          {t("button.cancel")}
        </Button>,
        <Button
          onClick={handleDelete}
          color="primary"
          variant="outlined"
          autoFocus
          disabled={loading}
        >
          {loading && <CircularProgress size={24} />}
          {t("button.i_confirm")}
        </Button>,
      ],
    };
    // dispatch it
    dispatch(MainActions.openDialog(dialog));
  };

  return (
    <Tooltip
      title={t("projectInvoice:delete_the_activity", {
        count: selectedIndexes.length,
      })}
    >
      <IconButton onClick={handleClick} disabled={loading}>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Icon>delete</Icon>
        )}
      </IconButton>
    </Tooltip>
  );
}

export default BulkDeleteButton;
