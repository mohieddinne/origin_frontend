import React from "react";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";

function SeeDataButton(props) {
  const { t } = useTranslation();

  const handleClick = (event) => {
    if (typeof props.onClickHandler === "function")
      props.onClickHandler(event);
  };

  return (
    <Button size="small" onClick={handleClick} variant="outlined">
      <span className="hidden sm:block lg:hidden">
        {t("button.data")}
      </span>
      <span className="block sm:hidden lg:block">
        {t("button.see_the_data")}
      </span>
    </Button>
  );
}

export default SeeDataButton;
