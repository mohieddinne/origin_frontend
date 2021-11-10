import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const FilterContext = React.createContext({});
export const FilterProvider = FilterContext.Provider;

const advancedFiltersFields = [
  {
    name: "folders",
    type: "list",
  },
  {
    name: "invoice_number",
    type: "list",
  },
  {
    name: "billing_date",
    type: "date",
  },
  {
    name: "amount",
    type: "range",
  },
  {
    name: "offices",
    type: "list",
  },
  {
    name: "staff",
    type: "list",
  },
  {
    name: "customers",
    type: "list",
  },

  {
    name: "fees_amount",
    type: "range",
  },
  {
    name: "amount_expenses",
    type: "range",
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
