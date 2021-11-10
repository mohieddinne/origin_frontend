import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTranslation } from "react-i18next";

function FavoriteConfirmation(props) {
  const { t } = useTranslation("ComFavoriteFilters");
  const { open, setOpen, action, favorite } = props;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{t("apply_filter")}</DialogTitle>
      <div className="px-24 pb-24">
        <p className="mb-20">
          {t("apply_filter_confirmation_p", {
            name: favorite?.name || "",
          })}
        </p>
        <div className="flex gap-8 justify-end">
          <Button
            onClick={() => setOpen(false)}
            disableElevation
            variant="outlined"
          >
            {t("translation:button.cancel")}
          </Button>
          <Button
            onClick={() => action(favorite)}
            disableElevation
            variant="contained"
            color="primary"
          >
            {t("translation:button.i_confirm")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default FavoriteConfirmation;
