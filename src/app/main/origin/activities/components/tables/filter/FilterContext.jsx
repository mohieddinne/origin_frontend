import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const FilterContext = React.createContext({});
export const FilterProvider = FilterContext.Provider;

const advancedFiltersFields = [
  {
    name: "statut",
    type: "list",
  },

  {
    name: "responsible",
    type: "list",
  },
  {
    name: "customers",
    type: "list",
  },
  {
    name: "categories",
    type: "list",
  },
  {
    name: "activities",
    type: "list",
  },
  {
    name: "activity_date",
    type: "date",
  },
  {
    name: "hours",
    type: "range_hour",
  },
  {
    name: "billed_hours",
    type: "range_hour",
  },
  {
    name: "hourly_rates",
    type: "range",
  },
  {
    name: "invoice_number",
    type: "list",
  },
];

export function ContextWrapper(props) {
  const [isOpen, setOpen] = useState(false);

  const usesAdvancedFilters = useSelector(
    ({ auth }) => auth?.user?.data?.usesAdvancedFilters || false
  );

  useEffect(() => {
    setOpen(usesAdvancedFilters);
  }, [usesAdvancedFilters]);

  return (
    <FilterProvider
      value={{
        isOpen,
        setOpen,
        toggle: () => setOpen(!isOpen),
        advancedFiltersFields,
      }}
    >
      {props.children}
    </FilterProvider>
  );
}

export default FilterContext;
