import React from "react";
import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";

import fr_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "cApp", fr_CA);

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  name: "Clients",
  auth: "clients",
  routes: [
    {
      path: "/clients/list",
      component: React.lazy(() => import("./views/List")),
    },
    // Verify This Route
    {
      path: "/clients/item/new",
      component: React.lazy(() => import("./components/tabs/Header")),
    },
    {
      path: "/clients/item/:id",
      component: React.lazy(() => import("./views/Item")),
    },

    {
      path: "/clients/item",
      component: () => <Redirect to="/app/client/item/new" />,
    },
    {
      path: "/clients/",
      component: () => <Redirect to="/clients/list" />,
    },
  ],
};

export default config;
