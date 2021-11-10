import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  button: {
    height: "30px",
    minWidth: "2rem",
  },
}));

const CustomButton = React.forwardRef((props, ref) => {
  const classes = useStyles();

  return (
    <Button {...props} ref={ref} classes={{ root: classes.button }}>
      {props.children}
    </Button>
  );
});

export default CustomButton;
