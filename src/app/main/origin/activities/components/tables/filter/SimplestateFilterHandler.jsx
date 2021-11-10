import React from "react";
import SimpleFilterMenu from "./SimpleFilterMenu";
import FilterButton from "./FilterButton";
import { useQuery, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import * as Actions from "../../../store/actions";
import FuseUtils from "@fuse/FuseUtils";

const query = gql`
  query filtersActivity {
    filtersActivity(
      slugs: [CUSTOMERS, CATEGORIES, INSURERS, EMPLOYEES, TYPES]
    ) {
      name
      data {
        id
        value
        ... on ActivityFilterEmployee {
          active
        }
        ... on ActivityFilterCustomer {
          name
        }
        ... on ActivityFilterCategory {
          name
        }
        ... on ActivityFilterType {
          name
        }
        ... on ActivityFilterInsurer {
          name
        }
      }
    }
  }
`;
function SimpleFilterHandler(props) {
  const [anchorEl, setAnchorEl] = React.useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const dispatch = useDispatch();

  const hasAccess = FuseUtils.hasPermission("activities");

  const { data } = useQuery(query, {
    skip: !hasAccess,
  });

  if (!hasAccess) return null;

  if (data) {
    const _data = {};
    for (const item of data.filtersActivity) {
      _data[item.name] = item.data;
    }
    dispatch(Actions.loadFilters(_data));
  }

  return (
    <div>
      <FilterButton handleClick={handleClick} />
      {anchorEl && (
        <SimpleFilterMenu
          {...props}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          // loading={loading}
        />
      )}
    </div>
  );
}

export default SimpleFilterHandler;
