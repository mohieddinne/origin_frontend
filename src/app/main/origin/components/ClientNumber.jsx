import React from "react";
import { Link, useHistory } from "react-router-dom";
import clsx from "clsx";

function ClientNumber({ id, value, className, component, props }) {
  const url = "/clients/item/" + id;

  const history = useHistory();

  const handleClick = () => {
    history.push(url);
  };

  if (!value) value = id;

  if (component) {
    const Component = component;
    return (
      <Component
        onClick={handleClick}
        className={clsx("cursor-pointer", { className: !className })}
        {...props}
      >
        {value}
      </Component>
    );
  }

  return (
    <Link to={url} className={className}>
      {value}
    </Link>
  );
}

export default ClientNumber;
