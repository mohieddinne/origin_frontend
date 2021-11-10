import React from "react";
import { SelectFormsy } from "@fuse";
import { useSelector } from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import CategoryButton from "../category/CategoryButton";
import SwitchFormsy from "./SwitchFormsy";
import ModulesSelect from "./ModulesSelect";

const item_types = [
  {
    name: "Lien vers un module",
    value: 1,
  },
  {
    name: "Vers un lien web",
    value: 2,
  },
  {
    name: "Lien vers une page de catégories",
    value: 3,
  },
];

function ItemType(props) {
  const { itemType } = props;

  const item = useSelector(({ navMenuAdmin }) => {
    return navMenuAdmin.editableItem;
  });

  return (
    <>
      <div className="flex mb-16">
        <div className="w-full">
          <SelectFormsy
            className="w-full"
            fullWidth
            name="type"
            id="type"
            label="Type de lien"
            autoComplete="off"
            value={item.type}
            disabled={item.id && item.type === 3}
            required
          >
            {item_types.map(function (item) {
              return (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              );
            })}
          </SelectFormsy>
        </div>
        <ExternalLink
          value={Boolean(item.external)}
          itemType={itemType}
        />
        <CategoryButton
          name="data"
          value={item.data || []}
          itemType={itemType}
        />
      </div>
      <ModulesSelect {...props} />
    </>
  );
}

function ExternalLink(props) {
  const { value, itemType } = props;
  if (itemType !== 2) return null;
  return (
    <SwitchFormsy
      id="external"
      name="external"
      className="w-1/2"
      label="Lien externe"
      labelPlacement="top"
      value={value}
    />
  );
}

export default ItemType;
