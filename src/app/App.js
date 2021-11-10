import React from "react";
import store from "./store";
import { FuseLayout, FuseTheme } from "@fuse";
import Provider from "react-redux/es/components/Provider";
import { BrowserRouter as Router } from "react-router-dom";
import jssExtend from "jss-extend";
import { Auth } from "./auth";
import AppContext from "./AppContext";
import routes from "./fuse-configs/routesConfig";
import { create } from "jss";
import {
  StylesProvider,
  jssPreset,
  createGenerateClassName,
} from "@material-ui/styles";
import { ApolloProvider } from "@apollo/client";
import client from "app/services/apolloService/apolloService";
import CatuAuthorizationWrapper from "@catu/components/AuthorizationWrapper";

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend()],
  // eslint-disable-next-line no-undef
  insertionPoint: document.getElementById("jss-insertion-point"),
});

const generateClassName = createGenerateClassName();

const App = () => {
  return (
    <AppContext.Provider
      value={{
        routes,
      }}
    >
      <ApolloProvider client={client}>
        <StylesProvider
          jss={jss}
          generateClassName={generateClassName}
        >
          <Provider store={store}>
            <Auth>
              <Router>
                <CatuAuthorizationWrapper>
                  <FuseTheme>
                    <FuseLayout />
                  </FuseTheme>
                </CatuAuthorizationWrapper>
              </Router>
            </Auth>
          </Provider>
        </StylesProvider>
      </ApolloProvider>
    </AppContext.Provider>
  );
};

export default App;
