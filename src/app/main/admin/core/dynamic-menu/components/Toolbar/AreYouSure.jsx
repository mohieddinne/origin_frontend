import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import { useTranslation } from "react-i18next";

function AreYouSure(props) {
  const { t } = useTranslation();
  const { cancel, submit } = props;

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    submit(() => setLoading(false));
  };

  return (
    <>
      <DialogTitle id="alert-dialog-title">
        {t("dynmnu:are_you_sure?")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("dynmnu:saving_confirmation")}
        </DialogContentText>
      </DialogContent>
      <DialogActions className="pr-24 pb-0">
        <Button
          onClick={cancel}
          variant="outlined"
          color="primary"
          autoFocus
          disabled={loading}
        >
          {t("dynmnu:cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disableElevation
          color="primary"
          disabled={loading}
        >
          {t("dynmnu:confirm")}
        </Button>
      </DialogActions>
    </>
  );
}

export default AreYouSure;
