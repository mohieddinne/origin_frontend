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
    name: "groups",
    type: "list",
  },
  {
    name: "customers",
    type: "list",
  },
  {
    name: "postal_code",
    type: "list",
  },
  {
    name: "tel_office",
    type: "list",
  },

  {
    name: "courriel",
    type: "list",
  },
  {
    name: "address",
    type: "list",
  },
  {
    name: "city",
    type: "list",
  },
  {
    name: "customer_type",
    type: "list",
  },
  {
    name: "tel_fax",
    type: "list",
  },
  {
    name: "cellular",
    type: "list",
  },
  {
    name: "tel_home",
    type: "list",
  },

  {
    name: "language",
    type: "list",
  },

  {
    name: "color",
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
