import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { withFormsy } from "formsy-react";
import _ from "@lodash";

function SwitchFormsy(props) {
  const importedProps = _.pick(props, [
    "autoWidth",
    "classes",
    "onChange",
    "value",
    "color",
    "disabled",
  ]);
  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage && props.errorMessage;
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
          <Switch
            {...importedProps}
            checked={value}
            onChange={changeValue}
          />
        }
        label={props.label}
      />
    </FormControl>
  );
}
export default React.memo(withFormsy(SwitchFormsy));
