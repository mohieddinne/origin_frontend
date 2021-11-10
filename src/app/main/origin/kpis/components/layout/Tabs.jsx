import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  content: {
    "& canvas": {
      maxHeight: "100%",
    },
  },
  tab: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRight: "0.25px solid #ffffff1f",
    cursor: "pointer",
    "&:first-of-type": {
      borderTopLeftRadius: "8px",
    },
    "&:last-of-type": {
      borderTopRightRadius: "8px",
      borderRight: "none",
    },
  },
  selectedProject: {
    cursor: "default",
    fontWeight: "bold",
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  projectMenuButton: {
    marginLeft: 1,
  },
}));

function Tabs({ tabs }) {
  const history = useHistory();

  const { tab: selectedTab } = useParams();
  const { t } = useTranslation();
  const classes = useStyles();

  const handleClick = (tabvalue) => {
    if (!tabvalue || tabvalue === selectedTab) return null;
    history.push("/app/kpis/t/" + tabvalue);
  };

  return (
    <>
      {tabs.map((item, key) => {
        return (
          <div
            key={key}
            onClick={() => handleClick(item)}
            className={clsx({
              [classes.selectedProject]: selectedTab === item,
              [classes.tab]: true,
              "flex items-center h-40 px-16 text-12 sm:text-16": true,
            })}
          >
            <span className="block md:hidden">
              {t(`kpisApp:tabs.${item}_short`)}
            </span>
            <span className="hidden md:block">
              {t(`kpisApp:tabs.${item}_long`)}
            </span>
          </div>
        );
      })}
    </>
  );
}

export default Tabs;
