import React, { useRef, useState } from "react";
import { Button, InputAdornment, Icon } from "@material-ui/core";
import { TextFieldFormsy } from "@fuse";
import Formsy from "formsy-react";
import * as Actions from "app/auth/store/actions/login.actions";
import { useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";
import { useMutation, gql } from "@apollo/client";
import LOGIN_DATA from "app/services/graphql/UserLoginData";
import jwtService from "app/services/originServices/jwtService";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(courriel: $email, pswd: $password) {
      token
      ${LOGIN_DATA}
    }
  }
`;

function JWTLoginTab(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [exec, { loading }] = useMutation(LOGIN_MUTATION);

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    const { password } = model;
    // Trim all white space from the email input
    const email = model.email.replace(/\s/g, "");
    exec({ variables: { email, password } })
      .then(({ data }) => {
        const { login } = data;
        if (login?.user && login?.token) {
          jwtService.setSession(login.token);
          dispatch(Actions.loginSuccess(login.user));
        }
      })
      .catch((error) => {
        let errors = {};
        // Handel backend errors
        if (error.graphQLErrors[0]) {
          switch (error.graphQLErrors[0].extensions.code) {
            case "USER_DEACTIVATED":
              errors.email = t(error.graphQLErrors[0].message);
              disableButton();
              break;
            case "INTERNAL_SERVER_ERROR":
              errors.email = "Erreur au serveur.";
              break;
            default:
              errors.password = t(
                error.graphQLErrors[0].extensions.code
              );
          }
        } else {
          errors.password = "Erreur au server.";
        }
        formRef.current.updateInputsWithError(errors);
      });
  }

  // Reset error when changing any component of the form
  function handelChange() {
    formRef.current.updateInputsWithError({
      email: null,
      password: null,
    });
  }

  // Trim all white space from the email input
  function trimWhiteSpace(value) {
    return value.replace(/\s/g, "");
  }

  return (
    <div className="w-full">
      <Formsy
        onValidSubmit={handleSubmit}
        onValid={enableButton}
        onInvalid={disableButton}
        onChange={handelChange}
        ref={formRef}
        className="flex flex-col justify-center w-full"
      >
        <TextFieldFormsy
          className="mb-16"
          type="email"
          name="email"
          label="Email"
          id="login-email"
          value=""
          valueHandler={trimWhiteSpace}
          validations={{
            isEmail: true,
          }}
          validationErrors={{
            isEmail: "Doit etre une adresse email valide",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Icon className="text-20" color="action">
                  email
                </Icon>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
        />

        <TextFieldFormsy
          className="mb-16"
          type="password"
          name="password"
          label="Password"
          id="login-password"
          value=""
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Icon className="text-20" color="action">
                  vpn_key
                </Icon>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          id="login-button"
          className="w-full mx-auto mt-16 normal-case"
          aria-label="LOG IN"
          disabled={!isFormValid || loading}
          value="legacy"
        >
          {loading && (
            <CircularProgress className="mr-16" size={15} />
          )}
          Login
        </Button>
      </Formsy>
    </div>
  );
}

export default JWTLoginTab;
