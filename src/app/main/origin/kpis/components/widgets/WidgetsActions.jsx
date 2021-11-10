import React from "react";
import ExcelButton from "./excel/ExcelButton";
import SeeDataButton from "./audit/SeeDataButton";
import DataTableButton from "./audit/DataTableButton";

function WidgetsActions(props) {
  const { index, widgetName, seeDataHandler } = props;
  return (
    <div className="flex flex-row justify-center sm:justify-end mt-16">
      {/* <ExcelButton index={index} widgetName={widgetName} /> */}
      <DataTableButton index={index} widgetName={widgetName} />
      <SeeDataButton onClickHandler={seeDataHandler} />
    </div>
  );
}

export default WidgetsActions;
