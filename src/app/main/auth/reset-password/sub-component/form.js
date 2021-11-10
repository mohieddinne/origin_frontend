import React, { useRef, useState } from "react";
import { Button, InputAdornment, Icon } from "@material-ui/core";
import { TextFieldFormsy } from "@fuse";
import Formsy from "formsy-react";
import { useMutation, gql } from "@apollo/client";

const RESET_PWD_MUTATION = gql`
  mutation SetForgotPassword($token: String!, $password: String!) {
    setForgotPassword(token: $token, newpassword: $password)
  }
`;

function ResetPasswordForm(props) {
  const formRef = useRef(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [success, setSuccess] = useState(false);

  const [exec, { loading }] = useMutation(RESET_PWD_MUTATION);

  // Get the last part of the URL
  const propsSplit = props.location.pathname.split("reset-password/");
  const token = propsSplit[propsSplit.length - 1];

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    const { password } = model;
    exec({ variables: { token, password } })
      .then(() => {
        disableButton();
        setSuccess(true);
        setTimeout(function () {
          props.history.push(`/login`);
        }, 3000);
      })
      .catch((error) => {
        let errors = {};
        // Handel backend errors
        if (error.graphQLErrors[0]) {
          switch (error.graphQLErrors[0].extensions.code) {
            case "INTERNAL_SERVER_ERROR":
              errors.email = "Erreur au serveur.";
              break;
            default:
              errors.password =
                error.graphQLErrors[0].extensions.code;
          }
        } else {
          errors.password = "Erreur au server.";
        }
        formRef.current.updateInputsWithError(errors);
      });
  }

  if (!token) {
    props.history.push("/");
  }

  return (
    <Formsy
      onValidSubmit={handleSubmit}
      onValid={enableButton}
      onInvalid={disableButton}
      ref={formRef}
      className="flex flex-col justify-center w-full"
    >
      {success === true && (
        <div className="MuiFormControl-root MuiTextField-root mb-16 MuiFormControl-fullWidth">
          <p>
            Votre mot de passe a été réinitialisé, vous serez redirigé
            à la page de connexion.
          </p>
        </div>
      )}
      <TextFieldFormsy
        className="mb-16"
        autoFocus
        fullWidth
        type="password"
        name="password"
        label="Nouveau mot de passe"
        id="reset-password-password"
        value=""
        validations={{
          minLength: 5,
          maxLength: 25,
          matchRegexp:
            /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/,
        }}
        validationErrors={{
          minLength: "5 caractères au minimum",
          maxLength: "25 caractères au maximum",
          matchRegexp:
            "Doit être un mot de passe plus sécuritaire (au moins 1 lettre, 1 chiffre et 1 caractère spécial)",
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
        autoFocus
        fullWidth
        type="password"
        name="password2"
        label="Confirmez mot de passe"
        id="reset-password-password2"
        value=""
        validations={{
          equalsField: "password",
        }}
        validationErrors={{
          equalsField: "Les mots de passe ne sont pas identiques",
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

      <Button
        type="submit"
        variant="contained"
        color="primary"
        id="reset-password-button"
        className="w-224 mx-auto mt-16"
        aria-label="RESET"
        disabled={!isFormValid || loading}
        value="legacy"
      >
        Envoyer
      </Button>
    </Formsy>
  );
}

export default ResetPasswordForm;
