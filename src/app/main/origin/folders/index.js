import React from "react";
import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";
import fr_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "dApp", fr_CA);

const config = {
  settings: {},
  name: "Dossiers",
  auth: "folders",
  routes: [
    {
      path: "/app/folders/list",
      component: React.lazy(() => import("./views/List")),
    },
    {
      path: "/app/folders/item/new",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/app/folders/item/:id",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/app/folders/setting/:id",
      component: React.lazy(() => import("./views/SettingPage")),
    },
    {
      path: "/app/folders/item",
      component: () => <Redirect to="/app/dossiers/item/new" />,
    },
    {
      path: "/app/folders/",
      component: () => <Redirect to="/app/folders/list" />,
    },
    // For lagacy
    {
      path: "/dossiers/",
      component: () => <Redirect to="/app/folders/list" />,
    },
  ],
};

export default config;
