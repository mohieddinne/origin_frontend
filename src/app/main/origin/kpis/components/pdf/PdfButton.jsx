import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import * as MainActions from "app/store/actions";
import PdfModal from "./PdfModal";

function PdfButton({ index }) {
  const dispatch = useDispatch();
  const loading = useSelector(({ kpisApp }) => kpisApp.loading > 0);

  const handleOpen = () => {
    dispatch(
      MainActions.openDialog({
        fullWidth: false,
        maxWidth: "sm",
        actions: [<CloseBtn />],
        content: <PdfModal index={index} />,
      })
    );
  };

  return (
    <Button
      size="small"
      variant="outlined"
      className="h-32"
      onClick={handleOpen}
      disabled={loading}
    >
      <PictureAsPdfIcon />
    </Button>
  );
}

function CloseBtn() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <Button
      onClick={() => dispatch(MainActions.closeDialog())}
      color="primary"
      autoFocus
    >
      {t("close")}
    </Button>
  );
}

export default PdfButton;
