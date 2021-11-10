import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const FilterContext = React.createContext({});
export const FilterProvider = FilterContext.Provider;

const advancedFiltersFields = [
  {
    value: "0",
    name: "statut",
    type: "list",
  },
  {
    value: "1",
    name: "offices",
    type: "list",
  },
  {
    value: "2",
    name: "staff",
    type: "list",
  },
  {
    value: "3",
    name: "recu_par",
    type: "list",
  },
  {
    value: "4",
    name: "losses",
    type: "list",
  },
  {
    value: "5",
    name: "type_of_building",
    type: "list",
  },
  {
    value: "6",
    name: "groups",
    type: "list",
  },
  {
    value: "7",
    name: "customers",
    type: "list",
  },
  {
    value: "8",
    name: "reference",
    type: "list",
  },
  {
    value: "9",
    name: "mandate_date",
    type: "date",
  },
  {
    value: "10",
    name: "loss_date",
    type: "date",
  },
  {
    value: "11",
    name: "appointment_date",
    type: "date",
  },
  {
    value: "12",
    name: "delivery_date",
    type: "date",
  },
  {
    value: "13",
    name: "closure_date",
    type: "date",
  },
  {
    value: "14",
    name: "budget",
    type: "range",
  },
  {
    value: "15",
    name: "judgment_number",
    type: "list",
  },
  {
    value: "16",
    name: "forfait",
    type: "list",
  },
  {
    value: "17",
    name: "postal_code",
    type: "list",
  },
  {
    value: "18",
    name: "contractor",
    type: "list",
  },
  {
    value: "19",
    name: "phone_number",
    type: "list",
  },
  {
    value: "20",
    name: "ville_perte",
    type: "list",
  },
  {
    value: "21",
    name: "province_loss",
    type: "list",
  },
  {
    value: "22",
    name: "courriel",
    type: "list",
  },
  {
    value: "23",
    name: "marque_ve",
    type: "list",
  },
  {
    value: "24",
    name: "no_stock_ve",
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
