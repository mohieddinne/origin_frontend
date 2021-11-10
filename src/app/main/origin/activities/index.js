import React from "react";
import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";

import fr_CA from "./i18n/fr_CA";
// import en_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "activities", fr_CA);
// i18next.addResourceBundle("en-CA", "activities", { locale: en_CA });

const config = {
  settings: {},
  name: "Activités",
  auth: "login",
  routes: [
    // Routes for data checking
    {
      path: "/app/activities/billable-data-active-folders/details",
      component: React.lazy(() =>
        import("./views/BillableActiveFoldersDetails")
      ),
      auth: "login",
    },
    {
      path: "/app/activities/billable-data/details",
      component: React.lazy(() => import("./views/BillableDetails")),
      auth: "login",
    },
    {
      path: "/app/activities/not-billable-data/details",
      component: React.lazy(() =>
        import("./views/NotBillableDetails")
      ),
      auth: "login",
    },
    // Classic views
    {
      path: "/app/activities/item/:id?",
      component: React.lazy(() => import("./views/Item")),
      auth: "activities",
    },
    {
      path: "/app/activities/item",
      component: () => <Redirect to="/app/activities/item/new" />,
    },
    {
      path: "/app/activities/list",
      component: React.lazy(() => import("./views/List")),
      auth: "activities",
    },
    {
      path: "/app/activities",
      component: () => <Redirect to="/app/activities/list" />,
    },
    // Time sheet views
    {
      path: "/app/timesheet/list",
      component: React.lazy(() => import("./views/TimesheetView")),
      // auth: "timesheet",
    },
    {
      path: "/app/timesheet",
      component: () => <Redirect to="/app/activities/list" />,
    },
  ],
};

export default config;
