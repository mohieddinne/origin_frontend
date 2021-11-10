import React from "react";
import { useDispatch } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import * as MainActions from "app/store/actions";
import { useMutation, gql } from "@apollo/client";

const gQl = gql`
  mutation deleteHoliday($id: ID!) {
    deleteHoliday(id: $id)
  }
`;

function DeleteButton({ id, callback }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [exec, { loading }] = useMutation(gQl);

  const handleClose = () => dispatch(MainActions.closeDialog());

  const handleDelete = () => {
    exec({ variables: { id } })
      .then(() => {
        callback();
        handleClose();
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") console.log(err);
      });
  };

  const handleClick = () => {
    const dialog = {
      title: t("holidays:you_are_deleting_holiday_ques"),
      maxWidth: "sm",
      content: (
        <>
          <p className="my-4">
            {t("holidays:you_are_deleting_holiday")}
          </p>
          <p className="my-4">
            {t("holidays:you_are_deleting_holiday_desc")}
          </p>
        </>
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
    dispatch(MainActions.openDialog(dialog));
  };

  return (
    <Tooltip title={t("holidays:delete_the_holiday")}>
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
