import { useState } from "react";
import DashboardFilter from "./dashboard-components/Filters";
import DashboardLayout from "../../../dashboard/components/Layout";

function DashboardPlaygroundHandler() {
  const [employee, setEmployee] = useState(null);

  return (
    <DashboardPlayground
      employee={employee}
      handlers={{
        setEmployee,
      }}
    />
  );
}

function DashboardPlayground({ employee, handlers }) {
  return (
    <>
      <DashboardFilter handlers={handlers} state={{ employee }} />
      <DashboardLayout employee={employee} />
    </>
  );
}

export default DashboardPlaygroundHandler;
