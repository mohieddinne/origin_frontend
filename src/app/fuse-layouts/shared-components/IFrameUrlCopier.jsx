import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider,
  },
}));

function IFrameUrlCopier() {
  const classes = useStyles();
  const [url, setUrl] = useState(null);
  const { t } = useTranslation();

  window.addEventListener("message", (event) => {
    const data = event.data || event.message;
    if (isValidHttpUrl(data)) setUrl(data);
  });

  const handleClick = () => {
    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const iframes = document.getElementsByTagName("iframe");
      if (iframes.length === 0) setUrl(null);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!url) return null;

  return (
    <>
      <Tooltip title={t("copy_iframe_url")}>
        <Button className="h-64 w-64" onClick={handleClick}>
          <FileCopyIcon className="text-gray-700" />
        </Button>
      </Tooltip>
      <div className={classes.separator} />
    </>
  );
}

export default IFrameUrlCopier;
