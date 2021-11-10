import React, { useEffect } from "react";
import ActivitiesListUI from "./ActivitiesListUI";
import { useLazyQuery, gql } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as Actions from "../../store/actions";
import FuseUtils from "@fuse/FuseUtils";

const query = gql`
  query activities(
    $ids: [ID]
    $search: String
    $filters: [ArrayFilterInput]
    $paging: PagingOptions
  ) {
    activities(
      ids: $ids
      search: $search
      filters: $filters
      pagination: $paging
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        ... on Activity {
          date
          folderId
          employeeName
          category
          activiteType
          billableHours
          invoiceId
          invoiceDate
          yearAct
          nbrOfBillableHours
          projectInvoice
          responsible
          hours
        }
      }
    }
    options(
      slugs: ["category_activity_color", "dbrd_wgt5_prctg_color"]
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
  const [
    getActivities,
    { loading, data, error, refetch },
  ] = useLazyQuery(query, {
    variables: {
      search,
      filters: filterHandler(filters),
      paging: { first: 50, pointer: 0 },
    },
    fetchPolicy: "no-cache",
    // skip: true,
  });

  const options = {};
  if (data?.options) {
    (data.options || []).forEach(({ name, value }) => {
      try {
        options[name] = JSON.parse(value);
      } catch {
        options[name] = value;
      }
    });
  }

  return (
    <ActivitiesListUI
      getActivities={getActivities}
      data={data?.activities}
      loading={loading}
      error={error}
      refetch={refetch}
      options={options}
    />
  );
}

function List() {
  const dispatch = useDispatch();

  const search = useSelector(({ activityApp }) => {
    return activityApp.searchText;
  });
  const user = useSelector(({ auth }) => auth?.user);
  const filters = useSelector(({ activityApp }) => {
    return activityApp.filters || {};
  });

  const hasAccessOwn = FuseUtils.hasPermission({
    slug: "activities",
    permission: "can_view_own",
  });
  const hasAccessAll = FuseUtils.hasPermission({
    slug: "activities",
    permission: "can_view",
  });

  useEffect(() => {
    if (hasAccessOwn && !hasAccessAll) {
      dispatch(
        Actions.setFilters("responsible", [user.data.displayName])
      );
    }
  }, [hasAccessOwn, hasAccessAll, user.data.displayName, dispatch]);

  return <ListQuery {...{ search, filters }} />;
}

function StateHandler(props) {
  const dispatch = useDispatch();
  const location = useLocation();

  React.useLayoutEffect(() => {
    if (location.state) {
      if (location.state.noReset) {
        // do nothing
      } else if (location.state.filters) {
        dispatch(Actions.resetSearchAndFilters());
        const filters = {};
        for (const filter in location.state.filters) {
          if (location.state.filters[filter]) {
            filters[filter] = location.state.filters[filter];
          }
          console.log({ filters });
          dispatch(Actions.setFilter(filters));
        }
      }
    } else {
      // Reset
      dispatch(Actions.resetSearchAndFilters());
    }
  }, [dispatch, location]);

  return <List {...props} />;
}

export default StateHandler;
