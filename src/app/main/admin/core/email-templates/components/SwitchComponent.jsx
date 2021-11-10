import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { useMutation, gql } from "@apollo/client";

const gQl = gql`
  mutation activeEmailTemplate($id: ID!) {
    activeEmailTemplate(id: $id)
  }
`;

function SwitchComponent({ id, active }) {
  const [checked, check] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [mutate, { loading }] = useMutation(gQl);

  let timer = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(timer), []);

  useEffect(() => {
    check(active);
  }, [active]);

  function handleChange() {
    mutate({ variables: { id } })
      .then(() => {
        setSuccess(true);
        timer = setTimeout(() => setSuccess(false), 3000);
        check(!active);
      })
      .catch((err) => {
        setError(true);
        timer = setTimeout(() => setError(false), 3000);
        if (process.env.NODE_ENV !== "production") console.error(err);
      });
  }

  if (loading) return <CircularProgress className="mx-2" size={15} />;
  if (error) return <ErrorOutlineIcon />;
  if (success) return <CheckCircleOutlineIcon />;

  return (
    <Checkbox
      classes={{ root: "p-0" }}
      checked={checked}
      onChange={handleChange}
    />
  );
}

export default SwitchComponent;
