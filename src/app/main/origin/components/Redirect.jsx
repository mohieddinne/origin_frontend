import React from "react";
import { Link } from "react-router-dom";
const Redirect = (path, id) => {
  return <Link to={path}>{id}</Link>;
};

export default Redirect;
