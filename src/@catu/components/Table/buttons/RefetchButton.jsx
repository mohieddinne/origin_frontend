import React from "react";
import { useTranslation } from "react-i18next";
import RefreshIcon from "@material-ui/icons/Refresh";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  smooth: {
    "-webkit-transition": "all 0.5s ease-in-out",
    "-moz-transition": "all 0.5s ease-in-out",
    "-o-transition": "all 0.5s ease-in-out",
    transition: "all 0.5s ease-in-out",
  },
}));

function RefetchButton(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const ref = React.useRef(null);
  const [angle, setAngle] = React.useState(360);

  const handleOnclick = () => {
    try {
      props.refetch();
      ref.current.style.webkitTransform = "rotate(" + angle + "deg)";
      ref.current.style.mozTransform = "rotate(" + angle + "deg)";
      ref.current.style.msTransform = "rotate(" + angle + "deg)";
      ref.current.style.oTransform = "rotate(" + angle + "deg)";
      ref.current.style.transform = "rotate(" + angle + "deg)";
      setAngle(angle + 360);
    } catch (error) {}
  };

  if (typeof props.refetch !== "function") return null;
  return (
    <>
      <Tooltip title={t("table.actions_tooltips.refetch")}>
        <span>
          <Button
            aria-label="reftech the data"
            onClick={handleOnclick}
            disabled={props.loading}
          >
            <RefreshIcon ref={ref} className={classes.smooth} />
          </Button>
        </span>
      </Tooltip>
    </>
  );
}

export default RefetchButton;
