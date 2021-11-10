import React from "react";
import { Link } from "react-router-dom";
const Viewfolder = (id) => {
  return <Link to={`/app/folders/item/${id}`} />;
};

export default Viewfolder;
