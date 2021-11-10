import React, { useLayoutEffect, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../../store/actions";
import { useLocation } from "react-router-dom";
import ListUI from "./ListUI";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query factures($search: String, $filters: [ArrayFilterInput]) {
    factures(search: $search, filters: $filters) {
      NumeroFacture
      NumeroDossier
      DateFacturation
      MontantHonoraires
      MontantAdm
      MontantDepenses
      MontantFacture
      folders {
        Bureau
      }
      ratio
      reviser
      customer {
        NomClient
        NumeroClient
      }
    }

    options(
      slugs: ["dbrd_wgt5_prctg_color", "customers_type_color"]
    ) {
      name
      value
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
    variables: { filters: filterHandler(filters), search },
  });

  useEffect(() => {
    if (!data) return null;

    if (Array.isArray(data.factures)) {
      dispatch({
        type: Actions.GET_FACTURES,
        payload: data.factures,
      });
    }

    if (Array.isArray(data.options)) {
      dispatch({
        type: Actions.SET_OPTIONS,
        payload: data.options,
      });
    }
  }, [data, dispatch]);

  return <ListUI loading={loading} error={error} refetch={refetch} />;
}

function List() {
  const search = useSelector(({ factureApp }) => {
    return factureApp.searchText;
  });

  const filters = useSelector(({ factureApp }) => {
    return factureApp.filters;
  });

  return <ListQuery search={search} filters={filters} />;
}

function StateHandler(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector(
    ({ auth }) => auth.user.data && auth.user.data.NomEmploye
  );

  useLayoutEffect(() => {
    const { state } = location;
    if (location.state) {
      if (location.state.noReset) {
        // do nothing
      } else if (
        (state.Responsable && state.date_end && state.date_start) ===
        true
      ) {
        dispatch(
          Actions.setFilters(
            "staff",
            state.Responsable,
            state.date_end,
            state.date_start,
            true
          )
        );
      } else if (Array.isArray(state.Responsable)) {
        dispatch(
          Actions.setFilters(
            "staff",
            state.Responsable,
            state.date_end,
            state.date_start,
            true
          )
        );
      }
    } else {
      // Reset
      dispatch(Actions.resetSearchAndFilters());
    }
  }, [dispatch, location, user]);

  return <List {...props} />;
}

export default StateHandler;
