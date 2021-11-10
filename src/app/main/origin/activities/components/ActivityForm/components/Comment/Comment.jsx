import React from "react";
// import { useTranslation } from "react-i18next";
import { withFormsy } from "formsy-react";
import TextField from "@material-ui/core/TextField";
import CommentDialog from "./CommentDialog";

function CommentFormsy(props) {
  // const { t } = useTranslation();
  const errorMessage = props.errorMessage;
  const value = props.value || "";

  function changeValue(event) {
    const value = event.currentTarget.value;
    props.setValue(value);
    if (props.onChange) {
      props.onChange(event, value);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-8">
      <TextField
        className=""
        disabled={false}
        placeholder="Merci de rédiger un commentaire ou de selectionner un commentaire avec le bouton à coté"
        validations="isWords"
        required={props.required}
        multiline
        variant="outlined"
        rows={4}
        fullWidth
        name={props.name}
        value={value}
        error={Boolean(errorMessage)}
        helperText={errorMessage}
        onChange={changeValue}
      />

      <CommentDialog setValue={props.setValue} />
    </div>
  );
}

export default withFormsy(CommentFormsy);
