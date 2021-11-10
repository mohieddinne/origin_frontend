import React, { useState } from "react";
import { TextFieldFormsy } from "@fuse";
import DatePickerFormsy from "@catu/components/formsy/DatePickerFormsy";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Formsy from "formsy-react";
import { useMutation, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/actions";

const query = gql`
  mutation holiday($data: HolidayInput) {
    holiday(data: $data) {
      id
      name
      date
    }
  }
`;

function HolidayForm(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const item = props.item || {};
  const iLoading = props.loading || false;

  const [mutate, { loading }] = useMutation(query);
  const [submittable, setSubmittable] = useState(true);

  const handleSubmit = (modal) => {
    mutate({ variables: { data: modal } })
      .then(() => {
        dispatch(
          showMessage({
            message: item.id
              ? t("holidays:success_updating")
              : t("holidays:success_creating"),
            variant: "success",
          })
        );
        history.push("/app/holidays/list", { refetch: true });
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "production") console.error(err);
        dispatch(
          showMessage({
            message: t("holidays:error_handling"),
            variant: "error",
          })
        );
      });
  };

  return (
    <Formsy
      onSubmit={handleSubmit}
      onValid={() => setSubmittable(true)}
      onInvalid={() => setSubmittable(false)}
      className="p-16 sm:p-24 max-w-2xl"
    >
      <TextFieldFormsy
        id="id"
        name="id"
        type="hidden"
        value={item.id || ""}
      />
      <TextFieldFormsy
        className="my-8"
        label={t("name")}
        disabled={loading || iLoading}
        autofocus
        required
        validationErrors={{
          required: t("error.form.required"),
        }}
        id="name"
        name="name"
        fullWidth
        variant="outlined"
        value={item.name || ""}
      />
      <DatePickerFormsy
        className="my-8"
        label={t("calendar.date")}
        disabled={loading || iLoading}
        required
        validationErrors={{
          required: t("error.form.required"),
        }}
        id="date"
        name="date"
        fullWidth
        format="yyy-MM-dd"
        inputVariant="outlined"
        value={item.date || null}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={!submittable || loading || iLoading}
        type="submit"
        disableElevation
        className="my-8"
      >
        {loading ? t("loading") : t("button.send")}
      </Button>
    </Formsy>
  );
}

export default HolidayForm;
