import React from "react";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory } from "react-router-dom";

function ViewButton({ item }) {
  const history = useHistory();

  const handleEditClick = () => {
    const url = "/admin/email-templates/item";
    history.push(`${url}/${item.id}-${item.slug}`);
  };

  return (
    <IconButton size="small" onClick={handleEditClick}>
      <VisibilityIcon />
    </IconButton>
  );
}

export default ViewButton;
