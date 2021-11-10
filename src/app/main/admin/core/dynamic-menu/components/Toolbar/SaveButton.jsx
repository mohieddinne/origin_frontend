import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import AreYouSure from "./AreYouSure";
import { useMutation, gql } from "@apollo/client";
import userService from "app/services/originServices/userService";
import * as UserActions from "app/auth/store/actions/user.actions";
import * as Actions from "../../store/actions";
import * as MainActions from "app/store/actions";
import { prepareToServer } from "../../store/helpers";

const useStyles = makeStyles((theme) => ({
  actionsButton: {
    marginRight: "10px",
    height: "32px",
  },
  confirmationButton: {
    minWidth: "170px",
  },
  circularProgress: {
    width: "20px !important",
    height: "20px !important",
  },
}));

const query = gql`
  mutation menuItems($items: [MenuItemInput], $deletedItems: [Int]) {
    menuItems(items: $items, deletedItems: $deletedItems) {
      id
    }
  }
`;

function Toolbar(props) {
  const { t } = useTranslation();
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const [update, { loading }] = useMutation(query);

  const [synced, data, deletedIds] = useSelector(
    ({ navMenuAdmin }) => {
      let deletedIds = [];
      if (Array.isArray(navMenuAdmin.deletedItems))
        deletedIds = navMenuAdmin.deletedItems;
      return [navMenuAdmin.synced, navMenuAdmin.data, deletedIds];
    }
  );
  const sumbmitMenu = (callback) => {
    if (!data || synced) return false;
    const items = prepareToServer(data);
    console.log({ items });
    update({
      variables: {
        items,
        deletedItems: deletedIds,
      },
    })
      .then(() => {
        // Refetch data of the editor
        dispatch(Actions.doRefetch());
        // Update use accesses
        userService
          .getMyAccesses()
          .then((accesses) => {
            // Refrech the access of
            dispatch(UserActions.updateAccesses(accesses));
            dispatch(MainActions.doRefetchNavigation(true));
          })
          .catch((error) => {
            console.error(error);
          });
        // Show message
        dispatch(
          MainActions.showMessage({
            message: "Le menu est mis à jour.",
            variant: "success",
          })
        );
        dispatch(Actions.syncServer(true));
        dispatch(MainActions.closeDialog());
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production")
          console.error(error);
        dispatch(
          MainActions.showMessage({
            message: "Erreur lors de la mise à jour du menu.",
            variant: "error",
          })
        );
      })
      .finally(() => {
        if (typeof callback === "function") callback();
      });
    return;
  };

  const handleSubmitMenu = () => {
    const cancel = () => dispatch(MainActions.closeDialog());
    const submit = (callback) => sumbmitMenu(callback);
    dispatch(
      MainActions.openDialog({
        maxWidth: "sm",
        fullWidth: false,
        children: <AreYouSure cancel={cancel} submit={submit} />,
      })
    );
    return;
  };

  return (
    <Button
      size="small"
      className={clsx(
        classes.actionsButton,
        classes.confirmationButton
      )}
      variant="outlined"
      color="primary"
      onClick={handleSubmitMenu}
      disabled={synced || loading}
    >
      {loading ? (
        <CircularProgress className={classes.circularProgress} />
      ) : (
        t("dynmnu:save_menu")
      )}
    </Button>
  );
}

export default Toolbar;
