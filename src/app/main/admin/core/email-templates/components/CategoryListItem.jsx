import React from "react";
import { useHistory, useParams } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/styles";
import slugify from "slugify";

const useStyles = makeStyles(() => ({
  listItem: {
    color: "inherit!important",
    textDecoration: "none!important",
    height: 40,
    width: "calc(100% - 16px)",
    borderRadius: "0 20px 20px 0",
    paddingLeft: 24,
    paddingRight: 12,
    "& .list-item-icon": {
      marginRight: 16,
    },
  },
}));

function CategoryListItem({ disabled, item, handler }) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  const isSelected = id === item.id;

  const handleClick = () => {
    if (item.id) {
      let slug = "/admin/email-templates/list/";
      const name = slugify(item.name).toLowerCase();
      slug = slug + item.id + "-" + name;
      history.push(slug);
    }
    if (typeof handler === "function") handler();
  };

  return (
    <ListItem
      button
      id={item.id}
      className={classes.listItem}
      selected={isSelected}
      onClick={handleClick}
      disabled={disabled}
    >
      <ListItemText
        className="truncate pr-0"
        primary={item.name}
        disableTypography={true}
      />
    </ListItem>
  );
}
export default CategoryListItem;
