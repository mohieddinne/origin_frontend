import React from "react";
import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";

import fr_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "fApp", fr_CA);

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  name: "Factures",
  auth: "invoices",
  routes: [
    {
      path: "/app/invoices/list",
      component: React.lazy(() => import("./views/List")),
    },
    {
      path: "/app/invoices/item/new",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/app/invoices/item/:id",
      component: React.lazy(() => import("./views/Item")),
    },
    {
      path: "/app/invoices/item",
      component: () => <Redirect to="/app/invoices/item/new" />,
    },
    {
      path: "/app/invoices/",
      component: () => <Redirect to="/app/invoices/list" />,
    },
    // For legacy
    {
      path: "/factures/",
      component: () => <Redirect to="/app/invoices/list" />,
    },
  ],
};

export default config;
