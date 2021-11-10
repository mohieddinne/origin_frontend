import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import NewItemDialog from "../NewItemDialog";

const useStyles = makeStyles((theme) => ({
  actionsButton: {
    marginRight: "10px",
    height: "32px",
  },
}));

function NewButton(props) {
  const { t } = useTranslation();
  const classes = useStyles(props);

  const [open, setOpen] = useState(false);

  const disabled = useSelector(({ navMenuAdmin }) => {
    return !navMenuAdmin.data || navMenuAdmin.loading;
  });

  return (
    <>
      <Button
        size="small"
        className={classes.actionsButton}
        onClick={() => setOpen(true)}
        variant="outlined"
        color="primary"
        disabled={disabled}
      >
        {t("create")}
      </Button>
      <NewItemDialog open={open} setOpen={setOpen} />
    </>
  );
}

export default NewButton;
