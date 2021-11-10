import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import icons from "./icons-db.json";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  iconsGrid: {
    display: "flex",
    flexWrap: "wrap",
  },
  iconsItem: {
    textAlign: "center",
    width: "25%",
    flexGrow: 1,
    marginBottom: 10,
    position: "relative",
    height: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#e8e6e6",
    },
  },
  iconsItemSelected: {
    backgroundColor: "#e8e6e6",
  },
  iconsItemCaption: {
    textTransform: "uppercase",
    fontSize: 10,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    position: "relative",
    zIndex: 2,
    maxWidth: 100,
  },
  iconsItemIcon: {
    color: "rgb(117, 117, 117)",
    fontSize: 48,
    width: 48,
    height: 48,
    marginBottom: 10,
  },
}));

function IconsDialog(props) {
  const classes = useStyles();
  const { value, handleChange, strings, open, handleClose } = props;

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    let filtredIcons = icons;
    if (search) {
      filtredIcons = icons.filter((item) => {
        return item.name.includes(search.toLowerCase());
      });
    }
    setFilteredData(filtredIcons);
  }, [search]);

  function pickAndClose() {
    handleClose();
  }

  return (
    <Dialog
      open={open}
      fullWidth={true}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {strings.modalTitle}
        <div>
          <TextField
            type="text"
            fullWidth
            label={strings.searchLabel}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon>search</Icon>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </DialogTitle>
      <DialogContent className={classes.iconsGrid}>
        {filteredData.length > 0
          ? filteredData.map((icon, index) => {
              let classname_ = classes.iconsItem;
              if (value && icon.name === value) {
                classname_ =
                  classname_ + " " + classes.iconsItemSelected;
              }
              return (
                <div
                  key={index}
                  className={classname_}
                  onClick={() => handleChange(icon.name)}
                >
                  <Icon className={classes.iconsItemIcon}>
                    {icon.name}
                  </Icon>
                  <div className={classes.iconsItemCaption}>
                    {icon.name.split("_").join(" ")}
                  </div>
                </div>
              );
            })
          : strings.noIcons}
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          aria-label={strings.cancelLabel}
          label={strings.cancelLabel}
          onClick={handleClose}
        >
          {strings.cancelLabel}
        </Button>
        <Button
          variant="outlined"
          type="button"
          aria-label={strings.pickLabel}
          disabled={!value}
          onClick={pickAndClose}
        >
          {strings.pickLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default IconsDialog;
