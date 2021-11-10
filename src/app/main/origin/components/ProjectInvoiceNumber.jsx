import React from "react";
import { Link, useHistory } from "react-router-dom";
import clsx from "clsx";

function ProjectInvoiceNumber({
  invoiceId,
  folderId,
  value,
  component,
  className,
}) {
  const url =
    "/app/projectInvoice/item/" + folderId + "/" + invoiceId;
  const history = useHistory();

  const handleClick = () => {
    history.push(url);
  };

  if (!value) value = invoiceId;

  if (component === "div")
    return (
      <div
        onClick={handleClick}
        className={clsx("cursor-pointer", { className: !className })}
      >
        {value}
      </div>
    );

  return (
    <Link to={url} className={className}>
      {value}
    </Link>
  );
}

export default ProjectInvoiceNumber;
