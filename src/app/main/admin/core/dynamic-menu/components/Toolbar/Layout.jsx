import React from "react";
import NewButton from "./NewButton";
import SaveButton from "./SaveButton";

function ToolbarLayout() {
  return (
    <div className="px-24">
      <NewButton />
      <SaveButton />
    </div>
  );
}

export default ToolbarLayout;
