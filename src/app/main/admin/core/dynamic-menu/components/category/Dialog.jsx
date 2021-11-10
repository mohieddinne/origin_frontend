import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import CategoryCard from "./CategoryCard";
import update from "immutability-helper";
import Transition from "./Transition";
import clsx from "clsx";

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    minHeight: 240,
    margin: "0px 10px 10px 10px",
    boxShadow: "none",
    border: "3px dashed #8e8d8d",
    alignItems: "center",
    justifyContent: "center",
    background: "#fbfbfb",
    color: "#8e8d8d",
    cursor: "pointer",
    transition: "0.2s",
    "&:hover": {
      background: "#e4e4e4",
      borderColor: "#424242",
      color: "#424242",
    },
  },
  addIcon: {
    fontSize: "6em",
  },
});

const newItem = {
  title: "",
  image: "",
  color_text: null,
  color_background: null,
  link: "",
  external: false,
  isNew: true,
};

function Wrapper(props) {
  const { open, setOpen, value } = props;

  return (
    <Dialog
      fullWidth={true}
      maxWidth="lg"
      TransitionComponent={Transition}
      onClose={() => setOpen(false)}
      open={open}
    >
      <CategoriesDialogTitle />
      <CategoryDialog {...props} categories={value} />
    </Dialog>
  );
}

function CategoriesDialogTitle() {
  const name = useSelector(({ navMenuAdmin }) => {
    const editableItem = navMenuAdmin.editableItem || {};
    return editableItem.name || "";
  });
  return (
    <DialogTitle>
      {`Configuration de la page de catégorie(s) « ${name} »`}
    </DialogTitle>
  );
}

function CategoryDialog(props) {
  const classes = useStyles();

  const [categories, setCategories] = useState([...props.categories]);
  const moveCard = (dragIndex, hoverIndex) => {
    const dragCard = categories[dragIndex];
    setCategories(
      update(categories, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      })
    );
  };

  const deleteCard = (index) => {
    const data = categories.filter((category, i) => i !== index);
    setCategories(data);
  };

  const updateCard = (card, index) => {
    const data = categories.map((category, i) => {
      if (index === i) return { ...category, ...card };
      return category;
    });
    setCategories(data);
  };
  const newCard = () => {
    setCategories([...categories, newItem]);
  };
  const closeAndSave = () => {
    props.handleChange(categories);
    props.setOpen(false);
  };

  return (
    <>
      <DialogContent>
        <div className="flex flex-wrap py-12">
          {categories.map((category, i) => {
            return (
              <CategoryCard
                key={category.name}
                index={i}
                isNew={category.isNew}
                item={category}
                handlers={{
                  moveCard,
                  deleteCard,
                  updateCard,
                }}
              />
            );
          })}
          <Box
            m={1}
            onClick={newCard}
            className={clsx(
              classes.card,
              "rounded w-full sm:w-1/2 lg:w-1/4 flex flex-col"
            )}
          >
            <AddCircleIcon className={classes.addIcon} />
          </Box>
        </div>
      </DialogContent>
      <DialogActions className="justify-start">
        <Button
          type="button"
          variant="outlined"
          aria-label={props.cancelLabel || ""}
          label={props.cancelLabel || ""}
          onClick={newCard}
          className="ml-16 my-6"
        >
          Ajouter une catégorie
        </Button>
        <Button
          variant="contained"
          disableElevation
          color="primary"
          type="button"
          aria-label={props.pickLabel || ""}
          //disabled={!selected}
          onClick={closeAndSave}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </>
  );
}

export default Wrapper;
