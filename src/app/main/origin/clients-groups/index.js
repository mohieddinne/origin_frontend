import React from "react";
import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";
import fr_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "gApp", fr_CA);

const config = {
  settings: {},
  name: "Groupe de client",
  auth: "clients",
  routes: [
    {
      path: "/app/clients/groups/item/:itemId?-:itemSlug?",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/app/clients/groups/item/:itemId?",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/app/clients/groups/list",
      component: React.lazy(() => import("./views/List")),
    },
    {
      path: "/app/clients/groups/",
      component: () => <Redirect to="/app/clients/groups/list" />,
    },
  ],
};

export default config;
