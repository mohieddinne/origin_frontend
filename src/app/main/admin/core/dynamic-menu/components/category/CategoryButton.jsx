import React, { useState } from "react";
import { withFormsy } from "formsy-react";
import { useSelector } from "react-redux";
import SettingsIcon from "@material-ui/icons/Settings";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import CategoryDialog from "./Dialog";

function CategoryButton(props) {
  const { value, itemType, loading } = props;
  const itemId = useSelector(({ navMenuAdmin }) => {
    return navMenuAdmin.editableItem.id || null;
  });

  const [open, setOpen] = useState(false);

  const openCategoryDialog = () => {
    if (itemId) setOpen(true);
  };

  const handleChange = (data) => {
    const categories = data || [];
    props.setValue(categories);
    if (props.onChange) {
      props.onChange(categories);
    }
  };

  if (itemType !== 3) return null;
  return (
    <div>
      <CategoryDialog
        open={open}
        setOpen={setOpen}
        value={value}
        handleChange={handleChange}
      />
      <Tooltip title="Configuration" aria-label="configuration">
        <span>
          <Button
            variant="outlined"
            color="primary"
            aria-label="edit-category"
            id="edit-category"
            onClick={openCategoryDialog}
            disabled={itemId === 0 || loading}
          >
            <SettingsIcon />
          </Button>
        </span>
      </Tooltip>
    </div>
  );
}

export default withFormsy(CategoryButton);
