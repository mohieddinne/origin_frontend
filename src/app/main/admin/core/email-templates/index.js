import React from "react";
import { Redirect } from "react-router-dom";
import i18next from "i18next";

import fr_CA from "./i18n/fr_CA";
// import en_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "emltmp", fr_CA);
// i18next.addResourceBundle("en-CA", "emltmp", en_CA);

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  // TODO add the auth
  auth: "login",
  routes: [
    {
      path: "/admin/email-templates/item/:id?-:slug?",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/admin/email-templates/list/:id-:category?",
      component: React.lazy(() => import("./views/List.jsx")),
    },
    {
      path: "/admin/email-templates/list",
      component: React.lazy(() => import("./views/List.jsx")),
    },
    {
      path: "/admin/email-templates",
      component: () => <Redirect to="/admin/email-templates/list" />,
    },
  ],
};

export default config;
