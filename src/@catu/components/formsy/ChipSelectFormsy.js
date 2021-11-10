import _ from "@lodash";
import FilledInput from "@material-ui/core/FilledInput";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { withFormsy } from "formsy-react";
import React from "react";
import ChipSelect from "../ChipSelect";

function ChipSelectFormsy(props) {
  // An error message is returned only if the component is invalid
  const { errorMessage, value } = props;

  function input() {
    switch (props.variant) {
      case "outlined":
        return (
          <OutlinedInput
            labelWidth={props.label.length * 8}
            id={props.name}
          />
        );
      case "filled":
        return <FilledInput id={props.name} />;
      default:
        return <Input id={props.name} />;
    }
  }

  function changeValue(item) {
    let value;
    if (!Array.isArray(item)) {
      value = [item];
    } else {
      value = item;
    }
    props.setValue(value);
    if (props.onChange) {
      props.onChange(item);
    }
  }

  return (
    <FormControl
      error={Boolean(
        (!props.isPristine && props.showRequired) || errorMessage
      )}
      className={props.className}
      variant={props.variant}
    >
      {props.label && (
        <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
      )}
      <ChipSelect
        classNamePrefix="virtualized-chip-select-formsy"
        {...props}
        value={value}
        onChange={changeValue}
      />
      {Boolean(errorMessage) && (
        <FormHelperText>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
}

export default React.memo(withFormsy(ChipSelectFormsy));
