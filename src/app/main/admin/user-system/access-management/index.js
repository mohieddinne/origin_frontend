import React from "react";
import i18next from "i18next";

import fr_CA from "./i18n/fr_CA";
// import en_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "access", fr_CA);
// i18next.addResourceBundle("en-CA", "access", en_CA);

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: "permissions",
  routes: [
    {
      path: "/admin/user-management/accesses/:id?-?:slug",
      component: React.lazy(() => import("./views/List.jsx")),
    },
    {
      path: "/admin/user-management/accesses/:id?",
      component: React.lazy(() => import("./views/List.jsx")),
    },
  ],
};

export default config;
