import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import { withFormsy } from "formsy-react";
import _ from "@lodash";

function SelectFormsy(props) {
  const importedProps = _.pick(props, [
    "defaultValue",
    "autoWidth",
    "children",
    "classes",
    "displayEmpty",
    "input",
    "inputProps",
    "MenuProps",
    "multiple",
    "native",
    "onChange",
    "onClose",
    "onOpen",
    "open",
    "renderValue",
    "SelectDisplayProps",
    "value",
    "variant",
  ]);

  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage;
  const value = props.value || "";

  function input() {
    switch (importedProps.variant) {
      case "outlined":
        return (
          <OutlinedInput
            labelWidth={props.label.length * 8}
            id={props.name}
            name={props.name}
          />
        );
      case "filled":
        return <FilledInput id={props.name} name={props.name} />;
      default:
        return <Input id={props.name} name={props.name} />;
    }
  }

  function changeValue(event) {
    props.setValue(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FormControl
      disabled={props.disabled}
      error={Boolean(errorMessage)}
      required={props.required ? props.required : null}
      className={props.className}
      variant={importedProps.variant}
    >
      {props.label && (
        <InputLabel htmlFor={props.name}>{props.label}</InputLabel>
      )}
      <Select
        {...importedProps}
        value={value}
        onChange={changeValue}
        input={input()}
      />
      {Boolean(errorMessage) && (
        <FormHelperText>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
}

export default React.memo(withFormsy(SelectFormsy));
