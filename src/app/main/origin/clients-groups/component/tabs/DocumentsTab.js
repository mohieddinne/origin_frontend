import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { TextFieldFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import Formsy from "formsy-react";
import * as actions from "../../store/action";
import ColorFieldFormsy from "@catu/components/formsy/ColorFieldFormsy";

function DetailsTab({ formRef }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const canSubmit = useSelector(
    ({ ClientsGroupsApp }) => ClientsGroupsApp.form.canSubmit
  );
  const isEditable = useSelector(
    ({ ClientsGroupsApp }) => ClientsGroupsApp.form.isEditable
  );

  const item = useSelector(
    ({ ClientsGroupsApp }) => ClientsGroupsApp.form.data || null
  );
  const [data, setData] = React.useState({ ...item });

  React.useLayoutEffect(() => {
    setData({ ...item });
  }, [item]);

  return (
    <>
      <Formsy
        ref={formRef}
        onValid={() => {
          if (!canSubmit) {
            dispatch(actions.setSubmittable(true));
          }
        }}
        onInvalid={() => {
          if (canSubmit) {
            dispatch(actions.setSubmittable(false));
          }
        }}
        className="p-16 sm:p-24 max-w-2xl"
      >
        <TextFieldFormsy
          id="id"
          name="id"
          type="hidden"
          value={data && data.id ? data.id : null}
        />
        <TextFieldFormsy
          className="mt-8 mb-16"
          label={t("name")}
          disabled={!isEditable}
          autofocus
          validationErrors={{
            required: t("error.form.required"),
          }}
          id="name"
          name="name"
          fullWidth
          variant="outlined"
          value={data && data.name ? data.name : null}
        />
        <ColorFieldFormsy
          className="mb-16 w-full"
          fullWidth
          variant="outlined"
          type="input"
          name="color"
          id="color"
          label="Couleur du lien"
          value={data.color || ""}
          disabled={!isEditable}
          validations={{
            maxLength: 7,
          }}
          validationErrors={{
            maxLength: "7 caractères au maximum",
          }}
        />
      </Formsy>
    </>
  );
}

export default DetailsTab;
