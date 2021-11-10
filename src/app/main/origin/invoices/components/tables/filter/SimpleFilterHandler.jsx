import React from "react";
import SimpleFilterMenu from "./SimpleFilterMenu";
import FilterButton from "./FilterButton";

function SimpleFilterHandler() {
  const [anchorEl, setAnchorEl] = React.useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <FilterButton handleClick={handleClick} />
      {anchorEl && (
        <SimpleFilterMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      )}
    </div>
  );
}

export default SimpleFilterHandler;
