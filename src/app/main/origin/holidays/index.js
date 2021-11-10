import React from "react";
import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";
import fr_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "holidays", fr_CA);

const config = {
  settings: {},
  name: "Jours fériés",
  auth: "login",
  routes: [
    {
      path: "/app/holidays/item/:itemId?-:itemSlug?",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/app/holidays/item/:itemId?",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/app/holidays/list",
      component: React.lazy(() => import("./views/List")),
    },
    {
      path: "/app/holidays/",
      component: () => <Redirect to="/app/holidays/list" />,
    },
  ],
};

export default config;
