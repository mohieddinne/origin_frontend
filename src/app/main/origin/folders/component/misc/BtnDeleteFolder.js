import React, { useState } from "react";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { FolderService } from "app/services/originServices";
import * as MainActions from "app/store/actions/fuse";
import * as Actions from "../../store/actions";

function BtnUserDeleteIcon(props) {
  const { id } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [tooltip, openTooltip] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    openTooltip(false);
    setLoading(true);
    dispatch(
      MainActions.openDialog({
        fullWidth: false,
        maxWidth: "sm",
        title: t(
          "validation.are_you_sure_you_want_to_delete_the_element",
          {
            context: "male",
            element: t("fApp:folder"),
          }
        ),
        content: t(
          "validation.are_you_sure_you_want_to_delete_the_element_desc",
          {
            context: "male",
            element: t("fApp:folder"),
          }
        ),
        actions: [
          <Button onClick={handleAction} color="outlined">
            {t("button.i_confirm")}
          </Button>,
          <Button
            onClick={() => {
              setLoading(false);
              dispatch(MainActions.closeDialog());
            }}
            color="default"
            autoFocus
            variant="contained"
            disableElevation
          >
            {t("button.cancel")}
          </Button>,
        ],
        onClose: () => {
          openTooltip(false);
          setLoading(false);
        },
      })
    );
  };

  const handleAction = () => {
    FolderService.delete(id)
      .then(() => {
        setLoading(false);
        dispatch(MainActions.closeDialog());
        dispatch(Actions.deleteFolder(id));
        dispatch(
          MainActions.showMessage({
            message: t("dApp:success.delete"),
            autoHideDuration: 3000,
            variant: "success", // success error info warning null
          })
        );
      })
      .catch((e) => {
        setLoading(false);
        dispatch(
          MainActions.showMessage({
            message: t("dApp:error.delete"),
            autoHideDuration: 3000,
            variant: "error", // success error info warning null
          })
        );
        dispatch(MainActions.closeDialog());
        if (process.env.NODE_ENV !== "production") console.error(e);
      });
  };

  return (
    <Tooltip
      open={tooltip}
      onClose={() => openTooltip(false)}
      onOpen={() => openTooltip(true)}
      title={t("button.delete", {
        context: "male",
        element: t("dApp:folder"),
      })}
    >
      <IconButton
        size="small"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress
            style={{
              width: "25px",
              height: "25px",
            }}
          />
        ) : (
          <Icon fontSize="small">delete</Icon>
        )}
      </IconButton>
    </Tooltip>
  );
}

export default BtnUserDeleteIcon;
