import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import _ from "@lodash";
import IconsDialog from "./IconsDialog";
import { withFormsy } from "formsy-react";

const useStyles = makeStyles((theme) => ({
  removeButton: {
    color: "rgba(0,0,0,0.3)",
    marginLeft: "2px",
    cursor: "pointer",
  },
  previewButton: {
    cursor: "pointer",
  },
}));

function IconPickFormsy(props) {
  const classes = useStyles();

  const strings = {
    cancelLabel: props.cancelLabel || "Cancel",
    label: props.label || "Pick icon",
    modalTitle: props.modalTitle || "Pick an icon",
    pickLabel: props.pickLabel || "Pick",
    searchLabel: props.searchLabel || "Search",
    noIcons: props.noIcons || "No icons",
  };

  const importedProps = _.pick(props, [
    "autoComplete",
    "autoFocus",
    "children",
    "className",
    "defaultValue",
    "disabled",
    "FormHelperTextProps",
    "fullWidth",
    "id",
    "InputLabelProps",
    "inputProps",
    "InputProps",
    "inputRef",
    "label",
    "multiline",
    "name",
    "onBlur",
    "onChange",
    "onFocus",
    "placeholder",
    "required",
    "rows",
    "rowsMax",
    "select",
    "SelectProps",
    "type",
    "variant",
  ]);

  const errorMessage = props.errorMessage;

  let value = null;
  if (props.value) {
    value = props.value.toLowerCase();
  }

  const [open, openDialog] = useState(false);

  const handleOpen = () => openDialog(true);
  const handleClose = () => openDialog(false);

  const handleChange = (value) => {
    let icon = value;
    if (typeof icon === "string") icon = icon.toLowerCase();
    props.setValue(icon);
    if (typeof props.onPick === "function") props.onPick(icon);
  };

  return (
    <>
      <IconsDialog
        value={value}
        handleChange={handleChange}
        open={open}
        handleClose={handleClose}
        strings={strings}
      />
      <TextField
        {...importedProps}
        fullWidth
        type="input"
        value={value || ""}
        label={props.label}
        error={Boolean(errorMessage)}
        helperText={errorMessage}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <Icon
                onClick={handleOpen}
                className={classes.previewButton}
              >
                {value || "lens"}
              </Icon>
              <Icon
                className={classes.removeButton}
                onClick={() => {
                  handleChange(null);
                }}
              >
                remove_circle
              </Icon>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
}

export default React.memo(withFormsy(IconPickFormsy));
