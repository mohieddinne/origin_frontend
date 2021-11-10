import React from "react";
import { Redirect } from "react-router-dom";
import { default as i18next } from "i18next";
import fr_CA from "./i18n/fr_CA";
// import en_CA from "./i18n/fr_CA";

i18next.addResourceBundle("fr-CA", "umApp", fr_CA);
// i18next.addResourceBundle("en-CA", "umApp", { locale: en_CA });

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: "users",
  routes: [
    {
      path: "/admin/user-management/users/add",
      component: React.lazy(() => import("./UserFormPage")),
    },
    {
      path: "/admin/user-management/users/edit/:uid",
      component: React.lazy(() => import("./UserFormPage")),
    },
    {
      path: "/admin/user-management/users/list",
      component: React.lazy(() => import("./UserManagementPage")),
    },
    {
      path: "/admin/user-management/users",
      component: () => (
        <Redirect to="/admin/user-management/users/list" />
      ),
    },
  ],
};

export default config;
