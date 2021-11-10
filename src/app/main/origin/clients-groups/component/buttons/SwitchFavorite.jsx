import React, { useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { withRouter } from "react-router-dom";
import Switch from "@material-ui/core/Switch";
import { useDispatch } from "react-redux";
import * as MainActions from "app/store/actions";
import { useTranslation } from "react-i18next";

const query = gql`
  mutation clientGroup($data: ClientGroupsInput, $operation: String) {
    clientGroup(data: $data, operation: $operation) {
      id
      favorite
    }
  }
`;

function ViewButton({ item: data }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [update, { loading }] = useMutation(query);
  const [state, setState] = React.useState(false);

  const handleChange = (val) => {
    let variant = "success";
    update({
      variables: {
        data: { ...data, favorite: val },
        operation: "update",
      },
    })
      .then(() => {
        setState(val);
      })
      .catch(() => {
        variant = "error";
      })
      .finally(() => {
        dispatch(
          MainActions.showMessage({
            message: t(`gApp:${variant}.favorite`),
            variant,
          })
        );
      });
  };

  useEffect(() => {
    if (data) {
      if (data.favorite) {
        setState(true);
      } else {
        setState(false);
      }
    }
  }, [data]);

  return (
    <Switch
      disabled={loading}
      checked={state}
      onChange={(ev) => {
        handleChange(ev.target.checked);
      }}
      inputProps={{ "aria-label": "secondary checkbox" }}
    />
  );
}

export default withRouter(ViewButton);
