import React from "react";
import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";

import fr_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "kpisApp", fr_CA);

const config = {
  settings: {},
  name: "Indicateurs de performance",
  auth: "kpis",
  routes: [
    {
      path: "/app/kpis/data-table/:widget/:math",
      component: React.lazy(() =>
        import("./components/layout/WidgetData")
      ),
    },
    {
      path: "/app/kpis/data-table/",
      component: () => <Redirect to="/app/kpis" />,
    },
    {
      path: `/app/kpis/detail/:NumeroDossier`,
      component: React.lazy(() =>
        import("./components/layout/WidgetDetails")
      ),
    },
    {
      path: "/app/kpis/t/:tab?",
      component: React.lazy(() => import("./views/Main")),
    },
    {
      path: "/app/kpis",
      component: React.lazy(() => import("./views/Main")),
    },
  ],
};

export default config;
