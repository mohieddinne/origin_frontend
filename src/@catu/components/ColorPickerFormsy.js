import React from "react";
import { withFormsy } from "formsy-react";
import _ from "@lodash";
//import { ColorPalette } from "material-ui-color";

function ColorPickerFormsy(props) {
  const importedProps = _.pick(props, [
    "autoComplete",
    "autoFocus",
    "children",
    "className",
    "disabled",
    "disableToolbar",
    "FormHelperTextProps",
    "format",
    "fullWidth",
    "id",
    "InputLabelProps",
    "inputProps",
    "InputProps",
    "inputRef",
    "label",
    "margin",
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

  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage;
  const [state, setState] = React.useState(props.value);
  function changeValue(event) {
    setState(event);
    props.setValue(state);
    if (props.onChange) {
      props.onChange(event);
    }
  }
  return "hi";
}

export default React.memo(withFormsy(ColorPickerFormsy));
