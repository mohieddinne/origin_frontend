import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
  title: (props) => {
    const style = { fontWeight: "bold" };
    if (props.item.color_text) {
      style.color = `${props.item.color_text} !important`;
    }
    return style;
  },
  media: {
    height: 140,
  },
});

function CategoryPreview(props) {
  const item = props.item || {};
  const classes = useStyles({ item });
  const { handlers, index, isNew } = props;

  const defaultImage = "assets/images/news-block/default-image.png";

  if (props.edit) return null;

  return (
    <>
      <CardHeader
        classes={{
          subheader: classes.title,
        }}
        subheader={item.title || ""}
      />
      <CardMedia
        className={classes.media}
        image={item.image || defaultImage}
        title={item.title || ""}
      />
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => handlers.setEdit(true)}
        >
          Modifier
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            handlers.deleteCard(index);
          }}
          disabled={isNew}
        >
          Supprimer
        </Button>
      </CardActions>
    </>
  );
}

export default CategoryPreview;
