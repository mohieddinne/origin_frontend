import React, { useState } from "react";
import { withFormsy } from "formsy-react";
import _ from "@lodash";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import LensIcon from "@material-ui/icons/Lens";
import RemoveIcon from "@material-ui/icons/Remove";

function ColorFieldFormsy(props) {
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

  // Color picker state
  const [displayCP, displayColorPicker] = useState(false);
  const handleClick = () => {
    if (!importedProps.disabled) displayColorPicker(!displayCP);
  };
  const handleClose = () => displayColorPicker(false);

  const handleChange = (color) => {
    if (importedProps.disabled) return null;
    let hex = color || null;
    if (color && color.hex) hex = color.hex;
    props.setValue(hex);
    if (typeof props.onPick === "function") props.onPick(hex);
  };

  const styles = reactCSS({
    default: {
      color: {
        color: `${value && value.length > 0 ? value : "#ffffff"}`,
        //border: '1px solid #ccc',
        background: "rgba(0,0,0,0.78)",
        borderRadius: "10000px",
        cursor: "pointer",
        fontSize: "15pt",
      },
      removeButton: {
        color: "white",
        background: "rgba(0,0,0,0.3)",
        borderRadius: "10000px",
        marginLeft: "5px",
        cursor: "pointer",
        fontSize: "15pt",
      },
      swatch: {
        padding: "5px",
        background: "#fff",
        borderRadius: "1px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
        display: "inline-block",
        cursor: "pointer",
      },
      popover: {
        position: "absolute",
        zIndex: "1999999",
      },
      cover: {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    },
  });

  return (
    <div>
      <TextField
        {...importedProps}
        type="input"
        value={value || ""}
        onChange={(e) => handleChange(e.target.value)}
        autoComplete="off"
        label={props.label}
        error={Boolean(errorMessage)}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <LensIcon
                onClick={handleClick}
                disabled={importedProps.disabled}
                style={styles.color}
              />
              <RemoveIcon
                style={styles.removeButton}
                disabled={importedProps.disabled}
                onClick={() => {
                  handleChange(null);
                }}
              />
            </InputAdornment>
          ),
        }}
      />
      {displayCP && (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <SketchPicker
            color={value || false}
            disableAlpha={
              props.disableAlpha ? props.disableAlpha : true
            }
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}

export default withFormsy(ColorFieldFormsy);
