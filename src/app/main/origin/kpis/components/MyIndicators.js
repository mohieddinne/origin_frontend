import React from "react";
import WidgetAvrgDelais from "./widgets/WidgetAvrgDelais";
import Filters from "./Filters";

function MyIndicators() {
  return (
    <div className="flex flex-wrap self-start mb-32 w-full lg:w-2/3">
      <div className="p-16 w-full">
        <Filters index={0} hideOptions={true} indicator={true} />
      </div>
      <div className="flex w-full mb-16 px-8">
        <WidgetAvrgDelais />
      </div>
    </div>
  );
}

export default MyIndicators;
