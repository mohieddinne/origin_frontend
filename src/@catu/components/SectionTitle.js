import React from "react";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

function SectionTitle({ title, classes }) {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h5" component="h2" className={classes}>
        {t(`${title}`)}
      </Typography>
      <Typography variant="subtitle1" component="p" gutterBottom>
        {t(`${title}_subtitle`)}
      </Typography>
    </>
  );
}
export default SectionTitle;
