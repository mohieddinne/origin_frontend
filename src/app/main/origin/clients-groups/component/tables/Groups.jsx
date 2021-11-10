import React from "react";
import { useDispatch } from "react-redux";
import * as Actions from "../../store/action";
import { useQuery, gql } from "@apollo/client";
import GroupsUI from "./GroupsUI";

const query = gql`
  query clientGroups {
    clientGroups {
      id
      name
      color
      clientCount
      fallback
      favorite
    }
  }
`;

function List() {
  const dispatch = useDispatch();

  const { data, loading, error } = useQuery(query);

  if (error) return;
  if (data && Array.isArray(data.clientGroups)) {
    dispatch(Actions.setGroups(data.clientGroups));
  }
  return <GroupsUI loading={loading} />;
}

export default List;
