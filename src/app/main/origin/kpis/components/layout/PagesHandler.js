import React from "react";
import MyIndicators from "../MyIndicators";
import ReportTEC from "app/main/origin/reports/components/tables/Reports";
import PlaygroundContainer from "../playground/PlaygroundContainer";
import DashboardPlayground from "../playground/Dashboard";
import { useParams } from "react-router-dom";

function PagesHandler() {
  const { tab } = useParams();

  let Component = "div";
  switch (tab) {
    case "company-indicators":
      Component = PlaygroundContainer;
      break;
    case "report-tec":
      Component = () => (
        <div className="rounded-8 m-16 border-1 bg-white">
          <ReportTEC date={new Date()} />
        </div>
      );
      break;
    case "dashboard":
      Component = DashboardPlayground;
      break;
    default:
      Component = MyIndicators;
      break;
  }

  return <Component />;
}

export default PagesHandler;
