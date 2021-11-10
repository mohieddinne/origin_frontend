import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import { withFormsy } from "formsy-react";
import _ from "@lodash";

function CheckboxFormsy(props) {
  const importedProps = _.pick(props, [
    "checkedIcon",
    "classes",
    "color",
    "disabled",
    "disableRipple",
    "icon",
    "id",
    "indeterminate",
    "indeterminateIcon",
    "inputProps",
    "inputRef",
    "onChange",
    "variant",
  ]);

  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage;
  const value = props.value;

  function changeValue(event) {
    props.setValue(event.target.checked);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FormControl
      error={Boolean(errorMessage)}
      className={props.className}
    >
      <FormControlLabel
        control={
          <Checkbox
            {...importedProps}
            type="checkbox"
            checked={value}
            onChange={changeValue}
          />
        }
        label={props.label}
      />
      {Boolean(errorMessage) && (
        <FormHelperText>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
}

export default React.memo(withFormsy(CheckboxFormsy));
