import { useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/actions";
import { useMutation, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import CustomButton from "./CustomButton";

const SAVE_FILTER = gql`
  mutation ($name: String!, $view: String!, $data: String!) {
    createSavedFilter(
      data: { name: $name, data: $data, view: $view }
    ) {
      id
      name
    }
  }
`;

function SaveFavorite(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation("ComFavoriteFilters");

  const [open, setOpen] = useState(false);
  const [submittable, setSubmittable] = useState(false);
  const [name, setName] = useState("");

  const [exec, { loading }] = useMutation(SAVE_FILTER);

  const handleMessage = (message, variant, replacements = {}) => {
    dispatch(
      showMessage({
        message: t(message, replacements),
        autoHideDuration: 3000,
        variant, // success error info warning null
      })
    );
  };

  const handleSave = () => {
    const model = props.getModel();
    if (!model || Object.keys(model).length <= 0) {
      handleMessage("no_filter_was_applied", "warning");
    } else {
      setOpen(true);
    }
  };

  const handleSubmit = () => {
    const filterModel = props.getModel();
    const data = JSON.stringify(filterModel);
    exec({ variables: { name, view: props.view, data } })
      .then(() => {
        handleMessage("your_filter_is_saved", "success", { name });
        // Call on success on the parent
        props.onSuccess();
        setOpen(false);
      })
      .catch((error) => {
        handleMessage("error_saving_filters", "error");
      });
  };

  return (
    <>
      <CustomButton
        onClick={handleSave}
        variant="contained"
        size="small"
        disableElevation
        disabled={loading}
      >
        <SaveIcon fontSize="small" />
      </CustomButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("name_the_filer")}</DialogTitle>
        <div className="px-24 pb-24">
          <p>{t("saving_the_filters_p1")}</p>
          <p>{t("saving_the_filters_p2")}</p>
          <TextField
            className="my-16"
            variant="outlined"
            fullWidth={true}
            label={t("favorite_name")}
            name="name"
            required={true}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              // submittable, setSubmittable
              if (name === "" && submittable) {
                setSubmittable(false);
              } else if (!submittable) {
                setSubmittable(true);
              }
            }}
            InputProps={{ autoComplete: "off" }}
          />
          <div className="flex gap-8 justify-end">
            <Button
              onClick={() => setOpen(false)}
              disableElevation
              variant="outlined"
            >
              {t("translation:button.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!submittable || loading}
              disableElevation
              variant="contained"
              color="primary"
            >
              {t("translation:button.save")}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
export default SaveFavorite;
