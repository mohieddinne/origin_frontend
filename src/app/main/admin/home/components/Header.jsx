import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  header: {
    background:
      "linear-gradient(to right, " +
      theme.palette.primary.dark +
      " 0%, " +
      theme.palette.primary.main +
      " 100%)",
    color: theme.palette.primary.contrastText,
  },
}));

function Header() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div
      className={clsx(
        classes.header,
        "flex flex-col items-center justify-center text-center p-16 sm:p-24 h-200 sm:h-300"
      )}
    >
      <FuseAnimate
        animation="transition.slideUpIn"
        duration={400}
        delay={100}
      >
        <Typography
          color="inherit"
          className="text-36 sm:text-56 font-light"
        >
          {t("administration")}
        </Typography>
      </FuseAnimate>

      <FuseAnimate duration={400} delay={300}>
        <Typography
          variant="subtitle1"
          color="inherit"
          className="opacity-75 mt-16 mx-auto max-w-512"
        >
          {t("administrationHome.home_sub_title")}
        </Typography>
      </FuseAnimate>
    </div>
  );
}

export default Header;
