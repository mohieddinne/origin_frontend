import React from "react";
import { useDispatch } from "react-redux";
import * as Actions from "../store/actions";
import { useQuery, gql } from "@apollo/client";
import FiltersMenu from "./FiltersMenu";
import FuseUtils from "@fuse/FuseUtils";

const query = gql`
  query filtersActivity($slugs: [String]) {
    filtersActivity(slugs: $slugs) {
      name
      data {
        name
        value
        actif
        id
      }
    }
  }
`;

function FilterDataQuery(props) {
  const dispatch = useDispatch();

  const slugs = [
    "customers",
    "categories",
    "activities",
    "insurers",
    "users",
    "employee",
  ];

  const hasAccess = FuseUtils.hasPermission("activities");
  /*const hasAccessToAll = FuseUtils.hasPermission({
    slug: "activities",
    permission: "can_view",
  });*/

  //if (hasAccessToAll) slugs.push("staff");

  const { loading, data } = useQuery(query, {
    variables: {
      slugs,
    },
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

  return <FiltersMenu {...props} loading={loading} />;
}

export default FilterDataQuery;
