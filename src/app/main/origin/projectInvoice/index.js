import React from "react";
// import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";

import fr_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "projectInvoice", fr_CA);

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  name: "projectInvoice",
  auth: "login",
  routes: [
    {
      path: "/app/projectInvoice/item/:folderId/:invoiceId",
      component: React.lazy(() => import("./views/List")),
    },

    // Verify This Route
  ],
};

export default config;
