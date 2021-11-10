import React from "react";
import { Redirect } from "react-router-dom";

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: "login",
  routes: [
    {
      path: "/admin/home",
      component: React.lazy(() => import("./views/Page")),
    },
    {
      path: "/admin",
      component: () => <Redirect to="/admin/home" />,
    },
  ],
};

export default config;
