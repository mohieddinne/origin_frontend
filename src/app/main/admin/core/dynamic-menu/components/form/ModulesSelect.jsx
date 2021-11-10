import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { SelectFormsy } from "@fuse";
import MenuItem from "@material-ui/core/MenuItem";
import { OriginConfigs } from "app/main/origin/originConfigs";

// Modules data
const modules = OriginConfigs.map((item) => {
  const url = item.routes[item.routes.length - 1].path;
  return {
    name: item.name,
    url,
    slug: url.slice(1),
  };
});

function ModulesSelect(props) {
  const { form, itemType, loading } = props;

  const item = useSelector(({ navMenuAdmin }) => {
    return navMenuAdmin.editableItem;
  });

  let value = "";
  if (item && item.link) value = item.link;
  else if (props.value) value = props.value;

  useEffect(() => {
    if (form) {
      const model = form.getModel();
      const toChange = { link: value };
      const mod = modules.find((item) => item.url === value);
      if (mod && !model.name) toChange.name = mod.name;
      form.updateInputsWithValue(toChange);
    }
  }, [form, value]);

  const handleModuleChange = (event) => {
    const { value } = event.target;
    const model = form.getModel();
    const toChange = { link: value };
    const mod = modules.find((item) => item.url === value);
    if (mod && !model.name) toChange.name = mod.name;
    form.updateInputsWithValue(toChange);
  };

  if (itemType !== 1) return null;

  return (
    <SelectFormsy
      className="mb-16 w-full"
      fullWidth
      name="module"
      id="module"
      label="Module de lien"
      autoComplete="off"
      value={value}
      onChange={handleModuleChange}
      disabled={loading}
      required={itemType === 1}
    >
      {modules.map((item) => {
        return (
          <MenuItem key={item.slug} value={item.url}>
            {item.name}
          </MenuItem>
        );
      })}
    </SelectFormsy>
  );
}

export default ModulesSelect;
