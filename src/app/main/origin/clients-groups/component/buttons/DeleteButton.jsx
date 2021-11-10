import React from "react";
import { useDispatch } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import * as Actions from "../../store/action";
import * as MainActions from "app/store/actions";
import { useMutation, gql } from "@apollo/client";

const gQl = gql`
  mutation clientGroup(
    $data: ClientGroupsInput!
    $operation: String
  ) {
    clientGroup(data: $data, operation: $operation) {
      id
    }
  }
`;

function DeleteButton({ id, count, active }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [exec, { loading }] = useMutation(gQl);

  const handleClose = () => dispatch(MainActions.closeDialog());
  const handleDelete = () => {
    exec({ variables: { data: { id }, operation: "delete" } })
      .then(({ data: { clientGroup } }) => {
        dispatch(Actions.deleteItem(clientGroup.id));
        handleClose();
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") console.log(err);
      });
  };

  const handleClick = () => {
    const dialog = {
      title: t("gApp:you_are_deleting_group"),
      maxWidth: "sm",
      content: (
        <Typography className="flex flex-col">
          <span className="text-gray-900 text-center  px-4 py-2 m-2">
            {t("gApp:you_are_deleting_group_Ques")}{" "}
          </span>
          <span className="text-gray-900 text-center  px-4 py-2 m-2">
            {" "}
            {+" " + count} {t("gApp:customer") + "  !  "}
          </span>

          {t("gApp:you_are_deleting_group_desc")}
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

  if (!active) {
    return null;
  }
  return (
    <Tooltip title={t("gApp:delete_the_group")}>
      <span>
        <IconButton onClick={handleClick} disabled={loading}>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Icon>delete</Icon>
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export default DeleteButton;
