import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FuseSplashScreen from "@fuse/components/FuseSplashScreen/FuseSplashScreen";
import * as userActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import jwtService from "app/services/originServices/jwtService";

function Auth(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [waitAuthCheck, setWait] = useState(true);

  useEffect(() => {
    const jwtCheck = () => {
      return new Promise((resolve, reject) => {
        jwtService.on("onAutoLogin", () => {
          jwtService
            .signInWithToken()
            .then((user) => {
              dispatch(userActions.setUserData(user));
              resolve();
            })
            .catch((error) => {
              dispatch(Actions.showMessage(t(error)));
              jwtService.logout();
              dispatch(userActions.logoutUser());
              reject();
            });
        });

        jwtService.on("onAutoLogout", (message) => {
          if (message) {
            dispatch(Actions.showMessage(t(message)));
          }
          jwtService.logout();
          dispatch(userActions.logoutUser());
          resolve();
        });

        jwtService.on("onNoAccessToken", () => {
          resolve();
        });

        jwtService.init();

        return Promise.resolve();
      });
    };

    jwtCheck()
      .then(() => {
        // Silence is golden
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      })
      .finally(() => setWait(false));
  }, [dispatch, t]);

  if (waitAuthCheck) return <FuseSplashScreen />;

  return <>{props.children}</>;
}

Auth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Auth;
