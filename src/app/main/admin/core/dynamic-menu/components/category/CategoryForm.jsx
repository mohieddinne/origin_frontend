import React, { useState } from "react";
import CardContent from "@material-ui/core/CardContent";
import InputAdornment from "@material-ui/core/InputAdornment";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Formsy from "formsy-react";
import { TextFieldFormsy } from "@fuse";
import CoverImageEditorFormsy from "./CoverImageEditor";
// import ColorField from "@catu/components/ColorField";
import ColorFieldFormsy from "@catu/components/formsy/ColorFieldFormsy";
import ExternalBtnFormsy from "./ExternalFormsy";

function CategoryForm(props) {
  const ref = React.useRef(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const item = props.item || {};
  const { handlers, index } = props;
  const handleSubmit = () => {
    const model = ref.current.getModel();
    handlers.updateCard(model, index);
    handlers.setEdit(false);
  };

  if (!props.edit) return null;

  return (
    <Formsy
      ref={ref}
      id="category-form"
      preventDefaultSubmit={true}
      onValidSubmit={handleSubmit}
      onValid={() => setIsFormValid(true)}
      onInvalid={() => setIsFormValid(false)}
    >
      <CardContent>
        <TextFieldFormsy
          className="mb-16 w-full"
          type="input"
          name="title"
          label="Titre"
          autoComplete="off"
          required
          value={item.title || ""}
          validationErrors={{
            required: "Ce champs est obligatoire.",
          }}
        />

        <TextFieldFormsy
          className="mb-16 w-full"
          type="url"
          name="link"
          label="Lien"
          autoComplete="off"
          required
          value={item.link || ""}
          validations={{
            maxLength: 250,
            isUrl: true,
          }}
          validationErrors={{
            required: "Ce champs est obligatoire.",
            maxLength: "250 caractères au maximum",
            isUrl: "Doit être un lien valide",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <ExternalBtnFormsy
                  name="external"
                  value={item.external || false}
                />
              </InputAdornment>
            ),
          }}
        />

        <div className="flex flex-wrap w-full">
          <div className="w-1/2 pr-8">
            <ColorFieldFormsy
              className="mb-16 w-full"
              fullWidth
              type="input"
              name="color_text"
              id="color_text"
              label="Texte"
              value={item.color_text}
              validations={{
                maxLength: 7,
              }}
              validationErrors={{
                maxLength: "7 caractères au maximum",
              }}
            />
          </div>
          <div className="w-1/2 pl-8">
            <ColorFieldFormsy
              className="mb-16 w-full"
              fullWidth
              type="input"
              name="color_background"
              id="color_background"
              label="Fond"
              value={item.color_background}
              validations={{
                maxLength: 7,
              }}
              validationErrors={{
                maxLength: "7 caractères au maximum",
              }}
            />
          </div>
        </div>
        <CoverImageEditorFormsy
          name="image"
          value={item.image || ""}
          elementId={item.id || null}
        />
      </CardContent>
      <CardActions className="flex">
        <Button
          size="small"
          color="primary"
          variant="contained"
          className="w-full"
          onClick={handleSubmit}
          disableElevation
          disabled={!isFormValid}
        >
          Accepter
        </Button>
        <Button
          size="small"
          color="primary"
          variant="outlined"
          className="w-full"
          onClick={() => {
            handlers.deleteCard(props.index);
          }}
          disabled={props.isNew}
        >
          Supprimer
        </Button>
        <Button
          size="small"
          color="primary"
          className="w-full"
          variant="outlined"
          onClick={() => {
            handlers.setEdit(false);
            if (props.isNew) {
              handlers.deleteCard(index);
            }
          }}
        >
          Annuler
        </Button>
      </CardActions>
    </Formsy>
  );
}

export default CategoryForm;
