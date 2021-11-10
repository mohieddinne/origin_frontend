import React from "react";
import { default as i18next } from "i18next";

import fr_CA from "./i18n/fr_CA";
// import en_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "chat", fr_CA);

const config = {
  settings: {},
  name: "Module de Chat",
  auth: "chat",
  routes: [
    {
      path: "/app/chat/r/:roomId",
      component: React.lazy(() => import("./views/Main")),
    },
    {
      path: "/app/chat/r/",
      component: React.lazy(() => import("./views/Main")),
    },
    {
      path: "/app/chat",
      component: React.lazy(() => import("./views/Main")),
    },
  ],
};

export default config;
