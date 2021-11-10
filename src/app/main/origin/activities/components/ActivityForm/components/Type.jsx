import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withFormsy } from "formsy-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListboxComponent from "@catu/components/formsy/Autocomplete/VirtualizedListboxComponent";
import FormContext from "../Context";

// [{ name: "category", value: ["Déplacement"] }

const QUERY = gql`
  query activitiesTypes($filters: [ArrayFilterInput]) {
    activitiesTypes(filters: $filters) {
      id
      name
      usedOnFolder
    }
  }
`;

function TypeSelect(props) {
  const { t } = useTranslation();
  const { setUsedOnFolder, setActivityType, category } =
    useContext(FormContext);

  const value = props.value || "";
  const errorMessage = props.errorMessage;

  const variables = { filters: [] };
  if (category) {
    variables.filters.push({
      name: "category",
      value: [category.name],
    });
  }

  const { data, loading, error } = useQuery(QUERY, { variables });

  const items = data?.activitiesTypes || [];

  const handleChange = (event, newValue) => {
    props.setValue(newValue);
    const item = items.find((e) => e.name === newValue);
    setActivityType(item?.name || null);
    setUsedOnFolder(item?.usedOnFolder || false);
    if (typeof props.onChange === "function") {
      props.onChange(event, newValue);
    }
  };

  return (
    <Autocomplete
      className="w-full"
      fullWidth={true}
      options={items.map((e) => e.name)}
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
              label={t("activities:activity")}
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

export default withFormsy(TypeSelect);
