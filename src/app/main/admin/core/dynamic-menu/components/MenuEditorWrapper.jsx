import React from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import MenuEditor from "./MenuEditor";

function MenuItemEditorWraper() {
  const item = useSelector(({ navMenuAdmin }) => {
    return navMenuAdmin.editableItem;
  });

  if (!item || !item.id)
    return (
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        className="mb-32 w-full"
      >
        Merci de sélectionner un élément à modifier.
      </Typography>
    );

  return <MenuEditor />;
}

export default MenuItemEditorWraper;
