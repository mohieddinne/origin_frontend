import React from "react";
import { FusePageCarded } from "@fuse";
import TimesheetTable from "../components/TimesheetTable";
import { TimesheetWrapper } from "../components/TimesheetTable/Context";

function TimesheetView() {
  return (
    <FusePageCarded
      classes={{
        root: "h-full overflow-x-scroll",
        toolbar: "p-0",
        header: "h-32",
        contentCard: "rounded-8 overflow-hidden",
        contentWrapper: "mb12",
      }}
      header={""}
      content={
        <TimesheetWrapper>
          <TimesheetTable />
        </TimesheetWrapper>
      }
    />
  );
}

export default TimesheetView;
