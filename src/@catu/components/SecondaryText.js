import React from "react";

function SecondaryText(props) {
  const { text, className } = props;

  return (
    <i className={className} style={{ color: "grey" }}>
      {text}
    </i>
  );
}

export default SecondaryText;
