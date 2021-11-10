import React from "react";
import { withFormsy } from "formsy-react";
import { useTranslation } from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery, gql } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  authCheckbox: {
    padding: "5px",
  },
  authCheckboxFormGroup: {
    margin: "10px 0px",
    padding: "0px 5px",
  },
}));

const gQlQuery = gql`
  query roles {
    roles {
      id
      name
    }
  }
`;

function AuthsFormsy(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { loading, error, data } = useQuery(gQlQuery);

  const roles = (data && data.roles) || [];

  // An error message is returned only if the component is invalid
  const errorMessage = props.errorMessage;
  let value = props.value;
  if (!value) value = roles.map((role) => parseInt(role.id));
  const checked = (element) => {
    if (!Array.isArray(value) || value.length <= 0) return false;
    return value.includes(element);
  };

  const changeValue = (event) => {
    const id = parseInt(event.target.value);
    let v = [...value];
    if (v.includes(id)) v = value.filter((role) => role !== id);
    else v.push(id);
    props.setValue(v);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  const selectAll = (event) => {
    const { checked } = event.target;
    let v = [];
    if (checked) v = roles.map((role) => parseInt(role.id));
    props.setValue(v);
  };

  if (loading)
    return (
      <>
        <FormLabel component="legend">Autorisation du lien</FormLabel>
        <div className="my-16">
          <div className="mb-8">{t("loading")}</div>
          <LinearProgress variant="query" />
        </div>
      </>
    );
  if (error) return "Erreur";

  return (
    <FormControl error={!!errorMessage} required component="fieldset">
      <FormLabel component="legend">Autorisation du lien</FormLabel>
      <FormGroup className={classes.authCheckboxFormGroup}>
        {roles.map((role) => (
          <FormControlLabel
            key={role.id}
            color="primary"
            control={
              <Checkbox
                value={role.id}
                checked={checked(role.id)}
                onChange={changeValue}
                className={classes.authCheckbox}
              />
            }
            label={role.name}
          />
        ))}
        <FormControlLabel
          key={0}
          color="primary"
          checked={value.length === roles.length}
          onChange={selectAll}
          control={<Checkbox className={classes.authCheckbox} />}
          label="Tous"
        />
      </FormGroup>
      {Boolean(errorMessage) && (
        <FormHelperText>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
}

export default withFormsy(AuthsFormsy);
