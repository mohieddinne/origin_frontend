import { useState } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import SaveFavorite from "./SaveFavorite";
import { useQuery, gql } from "@apollo/client";
import FavoriteConfirmation from "./FavoriteConfirmation";
import { useTranslation } from "react-i18next";
import DeleteFavorite from "./DeleteFavorite";
import InputSelect from "./InputSelect";

const SAVED_FILTERS_QUERY = gql`
  query ($view: String!) {
    savedFilters(where: { view: $view }) {
      id
      name
      data
    }
  }
`;

const useStyles = makeStyles(() => ({
  container: {
    minWidth: "500px",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  button: {
    height: "30px",
    minWidth: "2rem",
  },
  label: {
    color: "gray",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
  },
}));

function FavoriteFilters(props) {
  const { t } = useTranslation("ComFavoriteFilters");
  const { view } = props;
  const classes = useStyles();

  const [favorite, setFavorite] = useState("");
  const [isOpenConfirmModal, setOpenConfirmModal] = useState(false);

  const { data, loading, error, refetch } = useQuery(
    SAVED_FILTERS_QUERY,
    {
      variables: { view },
      skip: !view,
    }
  );

  const savedFilters = data?.savedFilters || [];

  const submitFiltersToProps = (favorite) => {
    try {
      if (favorite.data) {
        const data = JSON.parse(favorite.data);
        props.handleSavedFilter({ ...favorite, data });
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error, { data: favorite.data });
      }
    }
    setOpenConfirmModal(false);
  };

  const handleChange = (event) => {
    const filter = event.target.value;
    setFavorite(filter);
    if (filter !== "") {
      const model = props.getModel();
      if (model && Object.keys(model).length > 0) {
        setOpenConfirmModal(true);
      } else {
        submitFiltersToProps(filter);
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.label}>{t("your_favorites")}</div>
      <FormControl fullWidth={true}>
        <Select
          value={favorite}
          onChange={handleChange}
          fullWidth={true}
          disabled={loading || error}
          input={<InputSelect placeholder="Hello" />}
        >
          <MenuItem value="">
            <em>{t("favorite_filter")}</em>
          </MenuItem>
          {savedFilters.map((savedFilter) => (
            <MenuItem value={savedFilter} key={savedFilter.id}>
              {savedFilter.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <DeleteFavorite
        view={view}
        onSuccess={() => {
          refetch();
          setFavorite("");
        }}
        getModel={props.getModel}
        value={favorite}
      />
      <SaveFavorite
        view={view}
        onSuccess={refetch}
        getModel={props.getModel}
      />
      <FavoriteConfirmation
        favorite={favorite}
        open={isOpenConfirmModal}
        setOpen={setOpenConfirmModal}
        action={submitFiltersToProps}
      />
    </div>
  );
}
export default FavoriteFilters;
