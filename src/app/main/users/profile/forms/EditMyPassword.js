import React, { useRef, useState } from "react";
import { Button, InputAdornment, Icon } from "@material-ui/core";
import { TextFieldFormsy } from "@fuse";
import Formsy from "formsy-react";
import { useMutation, gql } from "@apollo/client";

const EDIT_PWD_MUTATION = gql`
  mutation SetNewPassword(
    $oldpassword: String!
    $password: String!
    $password2: String!
  ) {
    setNewPassword(
      oldpassword: $oldpassword
      newpassword: $password
      newpassword2: $password2
    )
  }
`;

function EditPasswordForm(props) {
  const formRef = useRef(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [success, setSuccess] = useState(false);

  const [exec, { loading }] = useMutation(EDIT_PWD_MUTATION);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    exec({ variables: model })
      .then(() => {
        setSuccess(true);
        formRef.current.updateInputsWithValue({
          oldpassword: "",
          password: "",
          password2: "",
        });
      })
      .catch((error) => {
        let errors = {};
        // Handel backend errors
        if (error.graphQLErrors[0]) {
          switch (error.graphQLErrors[0].extensions.code) {
            case "NOT_AUTHENTICATED":
            case "OLD_PASSWORD_NOT_OK":
              errors.email = error.graphQLErrors[0].message;
              break;
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

  const passwordValidation = {
    validations: {
      minLength: 5,
      maxLength: 25,
      matchRegexp:
        /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!=@#$%^&*])[a-zA-Z0-9!@=#$%^&*]+$/,
    },
    errors: {
      minLength: "5 caractères au minimum",
      maxLength: "25 caractères au maximum",
      matchRegexp:
        "Doit être un mot de passe plus sécuritaire (au moins 1 lettre, 1 chiffre et 1 caractère spécial)",
    },
  };

  return (
    <Formsy
      onValidSubmit={handleSubmit}
      onValid={enableButton}
      onInvalid={disableButton}
      ref={formRef}
      className="flex flex-col justify-center w-full"
    >
      {success && (
        <div className="MuiFormControl-root MuiTextField-root mb-16 MuiFormControl-fullWidth">
          <p>Votre mot de passe a été réinitialisé.</p>
        </div>
      )}
      <TextFieldFormsy
        className="mb-16"
        autoFocus
        fullWidth
        type="password"
        name="oldpassword"
        label="Ancien mot de passe"
        id="user-profile-edit-password-oldpassword"
        value=""
        validationErrors={{
          required: "Ce champs est obligatoire",
        }}
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

      <TextFieldFormsy
        className="mb-16"
        autoFocus
        fullWidth
        type="password"
        name="password"
        label="Nouveau mot de passe"
        id="user-profile-edit-password-password"
        value=""
        validations={passwordValidation.validations}
        validationErrors={passwordValidation.errors}
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

      <TextFieldFormsy
        className="mb-16"
        autoFocus
        fullWidth
        type="password"
        name="password2"
        label="Confirmez mot de passe"
        id="user-profile-edit-password-password2"
        value=""
        validations={{
          equalsField: "password",
        }}
        validationErrors={{
          equalsField: "Les mots de passe ne sont pas identiques!",
        }}
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
        className="w-224 mx-auto mt-16"
        aria-label="save"
        id="user-profile-edit-password-button"
        disabled={!isFormValid || loading}
      >
        Enregistrer
      </Button>
    </Formsy>
  );
}

export default EditPasswordForm;
