import React /*, { useLayoutEffect }*/ from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
import * as Actions from "../../store/actions";
import ListUI from "./ListUI";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query clients(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
  ) {
    clients(ids: $ids, search: $search, filters: $filters) {
      NumeroClient
      NomClient
      Inactif
      TypeClient
      Adresse
      Ville
      folders {
        TypeDePerte
      }

      group {
        name
        color
      }
    }
  }
`;
function filterHandler(filterObj) {
  const keys = Object.keys(filterObj);
  const filters = keys.map((name) => {
    const filter = filterObj[name];
    const value = Array.isArray(filter) ? filter : [filter];
    return {
      name,
      value,
    };
  });
  return filters;
}
function List() {
  const dispatch = useDispatch();

  const filters = useSelector(({ clientApp }) => clientApp.filters);
  const search = useSelector(({ clientApp }) => clientApp.searchText);
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      filters: filterHandler(filters),
      search,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (data && Array.isArray(data.clients)) {
    dispatch({
      type: Actions.GET_CLIENTS,
      payload: data.clients,
    });
  }
  return <ListUI loading={loading} error={error} refetch={refetch} />;
}

/*function StateHandler(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.state) {
      if (location.state.noReset) {
        // do nothing
      } else if (location.state.filters) {
        // Get the filters in the next data
      }
    } else {
      // Reset
      //dispatch(Actions.resetSearchAndFilters());
    }
  }, [dispatch, location]);

  return <List {...props} />;
}*/

export default List;
