import React, { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import * as Actions from "../../store/actions";
import ListUI from "./ListUI";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query folders($search: String, $filters: [ArrayFilterInput]) {
    folders(search: $search, filters: $filters) {
      NumeroDossier
      Reference
      Bureau
      Responsable
      RecuPar
      DateMandat
      TypeDePerte
      TypeBatiment
      VillePerte
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

function ListQuery({ filters, search }) {
  const dispatch = useDispatch();

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      filters: filterHandler(filters),
      search,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (data && Array.isArray(data.folders)) {
    dispatch({
      type: Actions.GET_FOLDERS,
      payload: data.folders,
    });
  }

  return <ListUI loading={loading} error={error} refetch={refetch} />;
}

function List() {
  const search = useSelector(({ folderApp }) => {
    return folderApp.searchText;
  });

  const filters = useSelector(({ folderApp }) => {
    return folderApp.filters;
  });

  return <ListQuery {...{ search, filters }} />;
}

function StateHandler(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.state) {
      if (location.state.noReset) {
        // do nothing
      } else if (location.state.filters) {
        dispatch(Actions.resetSearchAndFilters());
        const filters = {};
        for (const filter in location.state.filters) {
          if (location.state.filters[filter]) {
            let name = "";
            switch (filter) {
              case "types": // Link : 1-2  dans  mes Indicateur
                name = "TypeDePerte";
                break;
              case "offices": // Link : 1-2-3  dans  mes Indicateur
                name = "Bureau";
                break;
              case "customers_groups": // Link : 1-2-3  dans mes Indicateur
                name = "groupId";
                break;
              case "default_filter": // Link : 1-2-3  dans mes Indicateur
                name = "default_filter";
                break;
              default:
                name = filter;
            }
            filters[name] = location.state.filters[filter];
          }
          dispatch(Actions.setFilters(filters));
        }
      }
    } else {
      // Reset
      // dispatch(Actions.resetSearchAndFilters());
    }
  }, [dispatch, location]);

  return <List {...props} />;
}

export default StateHandler;
