import React from "react";
import WidgetReceivedFolder from "./widgets/WidgetReceivedFolder";
import WidgetGoal from "./widgets/WidgetGoal";
// import WidgetDelaisBudget from "./widgets/WidgetDelaisBudget";
import WidgetBillableHours from "./widgets/WidgetBillableHours";
import WidgetHoursNotBilledInClosedFolders from "./widgets/WidgetHoursNotBilledInClosedFolders";
import WidgetInvoiceProjectValidation from "./widgets/WidgetInvoiceProjectValidation";

function Layout({ employee }) {
  return (
    <div className="flex flex-col md:flex-row sm:p-8 container  mb-32">
      <div className="flex flex-1 flex-col min-w-0">
        <div className="widget w-full p-16 justify-center flex flex-col sm:flex sm:flex-row">
          <WidgetInvoiceProjectValidation employee={employee} />
        </div>
        <div className="flex flex-col sm:flex sm:flex-row">
          <div className="widget flex w-full sm:w-1/3 p-16">
            <WidgetReceivedFolder employee={employee} />
          </div>
          <div className="widget flex w-full sm:w-2/3 p-16">
            <WidgetGoal employee={employee} />
          </div>
        </div>
        <div className="flex flex-col sm:flex sm:flex-row">
          <div className="widget flex w-full p-16">
            <WidgetBillableHours employee={employee} />
          </div>
        </div>
        <div className="flex flex-col sm:flex sm:flex-row">
          <div className="widget flex w-full p-16">
            <WidgetHoursNotBilledInClosedFolders
              employee={employee}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-full md:w-320 pt-16"></div>
    </div>
  );
}

export default Layout;
