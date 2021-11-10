import React, { createRef, useMemo } from "react";
import { useSelector } from "react-redux";
import Filters from "../Filters";
import WidgLossesAndOffices from "../widgets/WidgLossesAndOffices";
import WidgGroups from "../widgets/WidgGroups";
import WidgCustomers from "../widgets/WidgCustomers";
import WidgTypes from "../widgets/WidgTypes";
import WidgOffices from "../widgets/WidgOffices";
import WidgBestCustomers from "../widgets/WidgBestCustomers";
import WidgetAvrgDelais from "../widgets/WidgetAvrgDelais";
import PlaygroundActions from "./PlaygroundActions.js";

function PlaygroundContainer() {
  const pgs = useSelector(({ kpisApp }) => kpisApp.filters);
  return (
    <div className="flex flex-wrap">
      {pgs.map((i, key) => (
        <Playground key={key} index={key} />
      ))}
    </div>
  );
}

function Playground({ index }) {
  const refs = useMemo(
    () => Array.from({ length: 5 }).map(() => createRef()),
    []
  );

  const classes = useSelector(({ kpisApp }) => {
    const w = (kpisApp.filters || []).length;
    if (w > 1) {
      return `w-full md:w-1/${w}`;
    }
    return "w-full lg:w-2/3";
  });
  const math = useSelector(({ kpisApp }) => kpisApp.math[index]);

  return (
    <div
      className={`flex flex-wrap self-start mb-32 p-16 ${classes}`}
    >
      <div className="w-full p-8">
        <PlaygroundActions index={index} />
      </div>
      <div className="w-full p-8">
        <Filters index={index} />
      </div>
      {math === "delays" && <WidgetAvrgDelais />}
      {["number", "income"].includes(math) && (
        <>
          <div className="flex w-full sm:w-2/3 p-8">
            <WidgLossesAndOffices index={index} reference={refs[0]} />
          </div>
          <div className="flex w-full sm:w-1/3 p-8">
            <WidgGroups index={index} reference={refs[1]} />
          </div>
          <div className="flex w-full sm:w-1/3 p-8">
            <WidgCustomers index={index} reference={refs[2]} />
          </div>
          <div className="flex w-full sm:w-1/3 p-8">
            <WidgTypes index={index} reference={refs[3]} />
          </div>
          <div className="flex w-full sm:w-1/3 p-8">
            <WidgOffices index={index} reference={refs[4]} />
          </div>
          <div className="flex w-full p-8">
            <WidgBestCustomers index={index} reference={refs[5]} />
          </div>
        </>
      )}
    </div>
  );
}

export default PlaygroundContainer;
