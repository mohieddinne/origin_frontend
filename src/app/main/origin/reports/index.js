import React from "react";
import { default as i18next } from "i18next";

import fr_CA from "./i18n/fr_CA";
// import en_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "Reports", fr_CA);
// i18next.addResourceBundle("en-CA", "activities", { locale: en_CA });

const config = {
  settings: {},
  name: "Reports",
  auth: "reports-tec",
  routes: [
    {
      path: "/app/report-tec",
      component: React.lazy(() => import("./views/List")),
    },
  ],
};

export default config;
