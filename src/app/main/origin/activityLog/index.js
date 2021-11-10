import React from "react";
import { default as i18next } from "i18next";

import fr_CA from "./i18n/fr_CA";
// import en_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "activity_log", fr_CA);

const config = {
  settings: {},
  name: "activity_log",
  auth: "login",
  routes: [
    {
      path: "/app/activity_log",
      component: React.lazy(() => import("./views/List")),
    },
  ],
};

export default config;
