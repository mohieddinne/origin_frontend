import { useContext } from "react";
import { useSelector } from "react-redux";
import FilterContext from "./FilterContext";
import FilterButtonUI from "../../../../components/FilterButtonUI";

function FilterButton({ handleClick }) {
  const { toggle, isOpen } = useContext(FilterContext);

  const activeFilters = useSelector(({ folderApp }) => {
    // TODO
    // Parcourire les elements dans le redux
    // Count only filters
    const keys = Object.keys(folderApp.filters);
    let activeFilters = 0;
    for (const filter of keys) {
      const value = folderApp.filters[filter];
      //Check if the value is OK
      const isarray = Array.isArray(value);
      if (isarray !== [] || isarray != null || isarray.length > 1) {
        if (value !== "00") {
          activeFilters++;
        }
      }
    }
    return activeFilters;
  });

  return (
    <FilterButtonUI
      {...{ toggle, handleClick, activeFilters, isOpen }}
    />
  );
}

export default FilterButton;
