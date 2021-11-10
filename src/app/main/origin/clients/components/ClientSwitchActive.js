import React from "react";
import Switch from "@material-ui/core/Switch";
import { mutate} from "app/services/originServices/clientService";

function SwitchComponent({ id, value, handler }) {
  const [value_, setValue] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setValue(value);
  }, [value]);

  function handleChange() {
    setLoading(true);
    mutate({
      Inactif: value_,
      NumeroClient: id,
    })
      .then(() => {
        if (typeof handler === "function") handler(id, !value);
        setValue(!value);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (process.env.NODE_ENV !== "production") console.error(error);
      });
  }

  return <Switch checked={value_} onChange={() => handleChange()} disabled={loading} />;
}

export default SwitchComponent;
