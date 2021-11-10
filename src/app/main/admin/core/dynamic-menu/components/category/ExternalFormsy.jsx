import React from "react";
import { withFormsy } from "formsy-react";
import IconButton from "@material-ui/core/IconButton";
import LinkIcon from "@material-ui/icons/Link";
import FilterFramesIcon from "@material-ui/icons/FilterFrames";

function ExternalBtnFormsy(props) {
  const value = props.value === true;

  const handleChange = (event) => {
    props.setValue(!value);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <IconButton onClick={handleChange}>
      {value ? <LinkIcon /> : <FilterFramesIcon />}
    </IconButton>
  );
}

export default withFormsy(ExternalBtnFormsy);
