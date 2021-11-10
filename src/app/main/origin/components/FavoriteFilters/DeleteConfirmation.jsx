import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTranslation } from "react-i18next";

function DeleteConfirmation(props) {
  const { t } = useTranslation("ComFavoriteFilters");
  const { open, setOpen, action, favorite, loading } = props;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{t("delete_filter")}</DialogTitle>
      <div className="px-24 pb-24">
        <p className="mb-20">
          {t("delete_filter_confirmation_p", { name: favorite || "" })}
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
            onClick={action}
            disableElevation
            variant="contained"
            color="secondary"
            disabled={loading}
            classes={{ root: "text-white bg-red hover:bg-red-700" }}
          >
            {t("translation:button.delete")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default DeleteConfirmation;
