import React from "react";
import i18next from "i18next";

import fr_CA from "./i18n/fr_CA";
// import en_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "dynmnu", fr_CA);
// i18next.addResourceBundle("en-CA", "dynmnu", en_CA);

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: "platform-admin",
  routes: [
    {
      path: "/admin/misc/dynamic-menu",
      component: React.lazy(() => import("./views/List")),
    },
  ],
};

export default config;
