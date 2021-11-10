import React, { useContext, useState, useRef } from "react";
import Collapse from "@material-ui/core/Collapse";
import FilterContext from "../filter/FilterContext";
import FilterTypeButton from "../../../../components/FilterTypeButton/index";
import * as Actions from "../../../store/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import Formsy from "formsy-react";
import FieldHandler from "./FieldHandler";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteFilters from "app/main/origin/components/FavoriteFilters";

const useStyles = makeStyles(() => ({
  button: {
    height: "30px",
    marginLeft: "1rem",
  },
}));

function AdvancedFiltersWrapper(props) {
  const ref = useRef(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const { isOpen, advancedFiltersFields } = useContext(FilterContext);

  const generateKey = () => {
    return new Date().getTime() * Math.floor(Math.random() * 99999);
  };
  const emptyField = () => ({
    key: generateKey(),
    name: "",
    type: "",
  });

  const [fields, setFields] = useState([emptyField()]);
  const [submittable, setSubmittable] = useState(true);

  // Send the filters to the main app
  const handleSubmit = (modal) => {
    dispatch(Actions.resetFilters());
    for (const [key, value] of Object.entries(modal)) {
      dispatch(Actions.setFilter(key, value));
    }
  };

  // Remove all filters, dispatch to the App
  const resetFilters = () => {
    setFields([generateKey()]);
    dispatch(Actions.resetFilters());
  };

  const handleAdd = () => setFields([...fields, emptyField()]);
  const handleRemove = (key) => {
    const __fields = fields.filter((v) => v.key !== key);
    if (__fields.length === 0) __fields.push(emptyField());
    setFields(__fields);
  };

  const updateField = (value, gIndex) => {
    const __fields = fields.map((field, index) => {
      if (index === gIndex) {
        return {
          ...field,
          ...value,
        };
      }
      return field;
    });
    setFields(__fields);
  };

  const handleSavedFilter = (filters) => {
    // Index the types
    const __types = {};
    for (const e of advancedFiltersFields) {
      __types[e.name] = e.type;
    }
    const keys = Object.keys(filters.data || {});
    const __fields = [];
    const __values = {};
    for (const key of keys) {
      const item = filters.data[key];
      __fields.push({
        key: generateKey(),
        name: key,
        type: __types[key],
      });
      __values[key] = item;
    }
    setFields(__fields);
    setTimeout(() => {
      ref.current.updateInputsWithValue(__values, true);
    }, 500);
  };

  // Factor used filter to a Set
  const usedFields = new Set();
  for (const field of fields) {
    usedFields.add(field.type);
  }

  return (
    <Collapse
      in={isOpen}
      timeout="auto"
      unmountOnExit={false}
      className="w-full"
    >
      <div className="mx-20 mt-8 mb-12 text-grey flex justify-between">
        <span>{t("filter_by")}</span>
        <div>
          <Button
            onClick={handleAdd}
            variant="outlined"
            size="small"
            disableElevation
            classes={{ root: classes.button }}
          >
            <AddIcon fontSize="small" />
          </Button>
          <FilterTypeButton
            onChange={() => {
              dispatch(Actions.resetFilters());
            }}
          />
          <Button
            onClick={resetFilters}
            variant="contained"
            size="small"
            disableElevation
            className="ml-8"
          >
            {t("reset_filters")}
          </Button>
        </div>
      </div>
      <Formsy
        onChange={(model) => {
          console.log({ model });
        }}
        onSubmit={handleSubmit}
        onValid={() => setSubmittable(true)}
        onInvalid={() => setSubmittable(false)}
        className="mx-20 mt-8 mb-12"
        ref={ref}
      >
        <div className="bg-gray-100 rounded-8 p-16 grid grid-cols-1 sm:grid-cols-2 gap-24 xl:grid-cols-3">
          {fields.map((field, index) => {
            return (
              <FieldHandler
                key={field.key}
                field={field}
                usedFields={usedFields}
                handleChange={(field) => updateField(field, index)}
                handleRemove={() => handleRemove(field.key)}
              />
            );
          })}
        </div>
        <div className="flex justify-between">
          <Button
            variant="contained"
            color="primary"
            disabled={!submittable}
            type="submit"
            disableElevation
            className="m-12"
          >
            {t("filter_the_table")}
          </Button>
          <FavoriteFilters
            view="folder"
            handleSavedFilter={handleSavedFilter}
            getModel={() => ref?.current?.getModel() || null}
          />
        </div>
      </Formsy>
    </Collapse>
  );
}

export default AdvancedFiltersWrapper;
