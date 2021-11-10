import React, { useRef, useState } from "react";
import { Button, InputAdornment, Icon } from "@material-ui/core";
import { TextFieldFormsy } from "@fuse";
import Formsy from "formsy-react";
import { useMutation, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";

const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgetPassword($email: String!) {
    forgetpassword(courriel: $email)
  }
`;

function ForgetPasswordForm() {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [success, setSuccess] = useState(false);

  const [exec, { loading }] = useMutation(FORGET_PASSWORD_MUTATION);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    // Trim all white space from the email input
    const email = (model.email || "").replace(/\s/g, "");
    exec({ variables: { email } })
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        const errors = {};
        // Handel backend errors
        if (error.graphQLErrors[0]) {
          switch (error.graphQLErrors[0].extensions.code) {
            case "INTERNAL_SERVER_ERROR":
              errors.email = "Erreur au serveur.";
              break;
            default:
              errors.email = t(
                "error.server_erros." +
                  error.graphQLErrors[0].extensions.code
              );
          }
        } else {
          errors.email = "Erreur au server.";
        }
        formRef.current.updateInputsWithError(errors);
      });
  }

  if (success) {
    return (
      <div className="flex flex-col justify-center w-full">
        <p
          className="mt-16 mb-32"
          id="forgot-password-success-message"
        >
          Un email est envoyé à votre adresse email avec les étapes à
          suivre pour réinitialiser votre mot de passe
        </p>
      </div>
    );
  }

  return (
    <Formsy
      onValidSubmit={handleSubmit}
      onValid={enableButton}
      onInvalid={disableButton}
      ref={formRef}
      className="flex flex-col justify-center w-full"
    >
      <TextFieldFormsy
        className="mb-16"
        autoFocus
        fullWidth
        type="email"
        name="email"
        label="Email"
        id="forgot-password-email"
        value=""
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        id="forgot-password-button"
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

export default ForgetPasswordForm;
