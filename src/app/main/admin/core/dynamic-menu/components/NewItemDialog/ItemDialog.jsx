import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Formsy, { addValidationRule } from "formsy-react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { TextFieldFormsy, SelectFormsy } from "@fuse";
import ModulesSelect from "../form/ModulesSelect";
import * as Actions from "../../store/actions";

const item_types = [
  {
    name: "Lien vers un module",
    value: 1,
  },
  {
    name: "Vers un lien web",
    value: 2,
  },
  {
    name: "Lien vers une page de catégories",
    value: 3,
  },
];

function ItemDialog(props) {
  const dispatch = useDispatch();
  const { open, setOpen } = props;
  const formRef = useRef(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [itemType, setItemType] = useState(2);

  const names = useSelector(({ navMenuAdmin }) => {
    let names = [];
    if (navMenuAdmin && navMenuAdmin.data) {
      names = navMenuAdmin.data.map((item) => {
        return (item.name || "").toLowerCase();
      });
    }
    return names;
  });

  const handleSubmit = (model) => {
    dispatch(Actions.updateItem({ ...model, roles: [] }));
    setOpen(false);
  };

  addValidationRule("isNotExistingName", function (values, value) {
    return !names.includes((value || "").toLowerCase());
  });

  return (
    <Dialog
      open={open}
      fullWidth={true}
      onClose={() => setOpen(false)}
    >
      <Formsy
        ref={formRef}
        id="create-new-menu-item"
        preventDefaultSubmit={true}
        onValidSubmit={handleSubmit}
        onValid={() => setIsFormValid(true)}
        onInvalid={() => setIsFormValid(false)}
        className="p-24 flex flex-col justify-center w-full"
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          className="mb-32 w-full"
        >
          Création d'un nouveau item
        </Typography>

        <SelectFormsy
          className="mb-16 w-full"
          fullWidth
          name="type"
          id="type"
          label="Type de lien"
          value={2}
          autoComplete="off"
          onChange={(e) => setItemType(e.target.value)}
          required
        >
          {item_types.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.name}
            </MenuItem>
          ))}
        </SelectFormsy>

        <ModulesSelect itemType={itemType} form={formRef.current} />

        <TextFieldFormsy
          className="mb-16 w-full"
          fullWidth
          type="input"
          name="name"
          id="name"
          label="Nom du lien"
          autoComplete="off"
          value=""
          validations={{
            maxLength: 30,
            isNotExistingName: true,
          }}
          validationErrors={{
            required: "Ce champs est obligatoire.",
            maxLength: "30 caractères au maximum",
            isNotExistingName: "Ce nom existe déja",
          }}
          required
        />

        <TextFieldFormsy
          className="hidden"
          type="hidden"
          name="link"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          aria-label="submit"
          id="submit"
          value=""
          disabled={!isFormValid}
        >
          Créer l'élément
        </Button>
      </Formsy>
    </Dialog>
  );
}

export default ItemDialog;
