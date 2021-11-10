import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";

const InputSelect = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(0, 0, 0, 0.23)",
    fontSize: "1.2rem",
    padding: "0.6rem 1rem 0.6rem 1rem",
    transition: theme.transitions.create([
      "border-color",
      "box-shadow",
    ]),
    "&:hover, &:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

export default InputSelect;
