import React from "react";
import DetailsAssurr from "../widgets/audit/DetailsAssurr";
import FusePageCarded from "@fuse/components/FusePageLayouts/carded/FusePageCarded";
import ListHeader from "@catu/components/HeaderList";

const DetailsAssurrtable = () => {
  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        contentCard: "rounded-8 overflow-hidden",
        contentWrapper: "mb12",
      }}
      header={<ListHeader icon=" multiline_chart chevron_right" />}
      content={<DetailsAssurr />}
      rightSidebarHeader=" "
      rightSidebarContent=" "
    />
  );
};
export default DetailsAssurrtable;
