import React from "react";
import TextField from "@material-ui/core/TextField";
import { withFormsy } from "formsy-react";
import _ from "@lodash";

const TextFieldFormsy = React.forwardRef((props, ref) => {
  const importedProps = _.pick(props, [
    "autoComplete",
    "autoFocus",
    "children",
    "className",
    "classes",
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
  const value = props.value || "";

  function changeValue(event) {
    let value = event.currentTarget.value;
    if (typeof props.valueHandler === "function") {
      value = props.valueHandler(value);
    }
    props.setValue(value);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <TextField
      {...importedProps}
      onChange={changeValue}
      value={value}
      inputRef={ref}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
    />
  );
});

export default React.memo(withFormsy(TextFieldFormsy));
