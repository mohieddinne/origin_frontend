import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

function TextTrimer({ string, length, className }) {
  if (!string || string.length <= length) return string || "";

  const subString = string.substring(0, length);

  return (
    <Tooltip title={string}>
      <span className={className}>{subString}...</span>
    </Tooltip>
  );
}

export default React.memo(TextTrimer);
