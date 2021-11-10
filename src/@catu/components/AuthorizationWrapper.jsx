import React, { useState, useLayoutEffect, useContext } from "react";
import PropTypes from "prop-types";
import { FuseUtils } from "@fuse";
import { matchRoutes } from "react-router-config";
import { useHistory, useLocation } from "react-router-dom";
import AppContext from "app/AppContext";
import { useSelector } from "react-redux";
import useHistoryLog from "@catu/hooks/useHistoryLog";

function CatuAuthorizationWrapper(props) {
  useHistoryLog();

  const history = useHistory();
  const location = useLocation();

  const { routes } = useContext(AppContext);
  const userRole = useSelector(({ auth }) => auth.user.role);

  const [accessGranted, setSccessGranted] = useState(true);

  useLayoutEffect(() => {
    if (!accessGranted) redirectRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessGranted]);

  useLayoutEffect(() => {
    const { pathname } = location;
    if (routes) {
      const matched = matchRoutes(routes, pathname)[0];
      let hasPermission = true;
      if (matched)
        hasPermission = FuseUtils.hasPermission(
          matched.route.auth,
          userRole
        );
      setSccessGranted(hasPermission);
    }
  }, [location, routes, userRole]);

  const redirectRoute = () => {
    const { pathname, state } = location;
    const redirectUrl =
      state && state.redirectUrl ? state.redirectUrl : "/";
    // if user is guest, redirect to Login Page
    if (!userRole || userRole === "") {
      history.push({
        pathname: "/login",
        state: { redirectUrl: pathname },
      });
    } else {
      history.push({ pathname: redirectUrl });
    }
  };

  // TODO add a unauthorized component
  if (!accessGranted) return null;

  return <>{props.children}</>;
}

CatuAuthorizationWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CatuAuthorizationWrapper;
