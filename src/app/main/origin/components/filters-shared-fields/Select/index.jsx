import { useQuery, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withFormsy } from "formsy-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListboxComponent from "./ListboxComponent";
import _pick from "lodash/pick";

const QUERY = gql`
  query filter($slug: String!, $after: String) {
    sharedFilter(slug: $slug, after: $after, limit: 1000000000) {
      nodes {
        name
        value
      }
    }
  }
`;

function StaffFilter(props) {
  const inputImportedProps = _pick(props, [
    "autoComplete",
    "autoFocus",
    "children",
    "className",
    "classes",
    "defaultValue",
    "disabled",
    "FormHelperTextProps",
    "fullWidth",
    "id",
    "InputLabelProps",
    "inputProps",
    "InputProps",
    "inputRef",
    "label",
    "multiline",
    "name",
    "onBlur",
    "onChange",
    "onFocus",
    "placeholder",
    "required",
    "rows",
    "rowsMax",
    "select",
    "SelectProps",
    "type",
    "variant",
  ]);

  const { t } = useTranslation();
  const name = props.field?.name;

  const errorMessage = props.errorMessage;
  const value = props.value || [];

  const { data, loading, error } = useQuery(QUERY, {
    variables: { slug: name, after: null },
    skip: !name,
  });

  const items = data?.sharedFilter?.nodes || [];
  const indexedItems = {};
  for (const item of items) {
    indexedItems[item.value] = item;
  }

  const handleChange = (event, value) => {
    props.setValue(value);
    if (typeof props.onChange === "function") {
      props.onChange(event, value);
    }
  };
  console.log({ name });

  return (
    <Autocomplete
      {...props}
      multiple
      id={"advanced_filters_" + name}
      name={name}
      fullWidth={true}
      getOptionLabel={(value) => {
        return indexedItems[value].name;
      }}
      options={items.map((e) => e.value)}
      loading={loading}
      disabled={loading || error}
      value={value}
      onChange={handleChange}
      ListboxComponent={ListboxComponent}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => option).join(", ")
      }
      renderInput={(params) => {
        return (
          <>
            <TextField
              {...inputImportedProps}
              {...params}
              required={false}
              label={t("dApp:" + name)}
              error={Boolean(errorMessage)}
              helperText={errorMessage}
              onChange={(event) => {
                console.log({ value: event.currentTarget.value });
              }}
              inputProps={{
                ...params.inputProps,
                autoComplete: "none",
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          </>
        );
      }}
    />
  );
}

export default withFormsy(StaffFilter);
