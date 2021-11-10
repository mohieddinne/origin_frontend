import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withFormsy } from "formsy-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListboxComponent from "@catu/components/formsy/Autocomplete/VirtualizedListboxComponent";
import FormContext from "../Context";

const QUERY = gql`
  query {
    activitiesCatagories {
      id
      name
    }
  }
`;

function CategoriesSelect(props) {
  const { t } = useTranslation();
  const { setCategory } = useContext(FormContext);

  const value = props.value || "";
  const errorMessage = props.errorMessage;

  const { data, loading, error } = useQuery(QUERY);

  const key = "name";

  const items = data?.activitiesCatagories || [];
  const indexedItems = {};
  for (const item of items) {
    indexedItems[item[key]] = item;
  }

  const handleChange = (event, newValue) => {
    props.setValue(newValue);
    setCategory(indexedItems[newValue]);
    if (typeof props.onChange === "function") {
      props.onChange(event, newValue);
    }
  };

  return (
    <Autocomplete
      className="w-full"
      fullWidth={true}
      options={[...items].map((e) => e[key])}
      loading={loading}
      disabled={loading || error}
      value={value}
      onChange={handleChange}
      ListboxComponent={ListboxComponent}
      renderInput={(params) => {
        return (
          <>
            <TextField
              {...params}
              required={false}
              variant="outlined"
              label={t("activities:category")}
              error={Boolean(errorMessage)}
              helperText={errorMessage}
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

export default React.memo(withFormsy(CategoriesSelect));
