import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Formsy from "formsy-react";
import { TextFieldFormsy } from "@fuse";
import ColorFieldFormsy from "@catu/components/formsy/ColorFieldFormsy";
import { useDispatch } from "react-redux";
import * as Actions from "../store/actions";
import clsx from "clsx";

import ItemType from "./form/ItemType";
import AuthsFormsy from "./form/AuthsFormsy";
import IconPickerFormsy from "./IconPickerFormsy";

function MenuItemEditor(props) {
  const { loading } = props;

  const item = useSelector(({ navMenuAdmin }) => {
    return navMenuAdmin.editableItem;
  });

  const dispatch = useDispatch();

  const formRef = useRef(null);

  const [itemType, setItemType] = useState(1);
  const [name, setName] = useState("");
  const [edited, setEdited] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Force the rerender of the form
  useEffect(() => {
    setName(item.name);
    setItemType(item.type);
    setEdited(false);
    if (formRef.current)
      formRef.current.updateInputsWithValue({ ...item });
    return () => {
      setEdited(false);
      setItemType(1);
      setName("");
    };
  }, [item]);

  const handleSubmit = (model) => {
    setEdited(false);
    dispatch(Actions.updateItem(model));
  };

  const handleModelChanges = (model) => {
    setEdited(true);
    if (model.name !== name) setName(model.name);
    if (model.type !== itemType) setItemType(model.type);
  };

  return (
    <Formsy
      onValidSubmit={handleSubmit}
      onValid={() => setIsFormValid(true)}
      onInvalid={() => setIsFormValid(false)}
      onChange={handleModelChanges}
      ref={formRef}
      className="px-16 flex flex-col justify-center w-full"
      id="dynamic-menu-form"
    >
      <TextFieldFormsy
        className="hidden"
        type="hidden"
        name="id"
        value={item.id}
      />

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        className="mb-32 w-full"
      >
        {`Édition de l'item ${name}`}
      </Typography>

      <ItemType itemType={itemType} form={formRef.current} />

      <TextFieldFormsy
        className="mb-16 w-full"
        fullWidth
        type="input"
        name="name"
        id="name"
        label="Nom du lien"
        autoComplete="off"
        value={item.name}
        disabled={loading}
        validations={{
          maxLength: 30,
        }}
        validationErrors={{
          maxLength: "30 caractères au maximum",
        }}
        required
      />

      <TextFieldFormsy
        className={clsx("mb-16 w-full", {
          hidden: itemType !== 2,
        })}
        fullWidth
        type={itemType === 2 ? "url" : "text"}
        name="link"
        id="link"
        label="Lien"
        autoComplete="off"
        value={item.link}
        validations={(() => {
          const validations = {
            maxLength: 180,
          };
          if (itemType === 2) validations.isUrl = true;
          return validations;
        })()}
        validationErrors={{
          maxLength: "180 caractères au maximum",
          isUrl: "Doit être un lien valide",
        }}
        disabled={loading || itemType !== 2}
        required={itemType === 2}
      />

      <div className="flex flex-wrap">
        <div className="w-1/2 pr-8">
          <ColorFieldFormsy
            className="mb-16 w-full"
            fullWidth
            type="input"
            name="color"
            id="color"
            label="Couleur du lien"
            value={item.color}
            disabled={loading}
            validations={{
              maxLength: 7,
            }}
            validationErrors={{
              maxLength: "7 caractères au maximum",
            }}
          />
        </div>
        <div className="w-1/2 pl-8 mb-16">
          <IconPickerFormsy
            className="w-full"
            autoComplete="off"
            disabled={loading}
            value={item.icon}
            name="icon"
            id="icon"
            label="Icone du lien"
            cancelLabel="Annuler"
            modalTitle="Sélectionner une icône"
            pickLabel="Choisir"
            searchLabel="Rechercher"
            noIcons="Pas d'icone"
          />
        </div>
      </div>

      <AuthsFormsy name="roles" value={item.roles} />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        aria-label="submit"
        id="submit"
        value=""
        disabled={!edited || !isFormValid || loading}
      >
        Enregistrer l'élément
      </Button>
    </Formsy>
  );
}

export default MenuItemEditor;
