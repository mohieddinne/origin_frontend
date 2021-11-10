import { useContext } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterContext from "../filter/FilterContext";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import FieldDynamicComponent from "./FieldDynamicComponent";

function FildHandler(props) {
  const { usedFields, field } = props;

  const { t } = useTranslation();

  const { advancedFiltersFields } = useContext(FilterContext);

  const value = useSelector(({ activityApp }) => {
    return field.name ? activityApp.filters[field.name] : "";
  });

  const handleRemove = () => props.handleRemove();

  return (
    <div className="w-full">
      <div className="flex mb-8">
        <FormControl fullWidth={true}>
          <InputLabel id="field_type">Champs du filtre</InputLabel>
          <Select
            value={field.name}
            onChange={(e) => {
              const name = e.target.value;
              props.handleChange({ name });
            }}
            labelId="field_type"
            fullWidth={true}
          >
            <MenuItem dense={true} value="">
              <em>Champs du filtre</em>
            </MenuItem>
            {advancedFiltersFields.map((field) => (
              <MenuItem
                dense={true}
                value={field.name}
                key={field.name}
                disabled={usedFields.has(field.name)}
              >
                {field.label || t("dApp:" + field.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button onClick={handleRemove} className="ml-4">
          <DeleteIcon fontSize="small" className="text-gray-800" />
        </Button>
      </div>
      <FieldDynamicComponent
        field={
          advancedFiltersFields.find((e) => e.name === field.name) ||
          null
        }
        value={value}
      />
    </div>
  );
}

export default FildHandler;
