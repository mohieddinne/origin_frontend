import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContentWrapper from "./CardContentWrapper";
import clsx from "clsx";

const ItemTypes = {
  CATEGORY: "category",
};

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    margin: "0px 10px 10px 10px",
    boxShadow: "none",
    border: "1px solid #d4d4d4",
  },
});

function CategoryCard(props) {
  const classes = useStyles();
  const ref = useRef(null);

  const { item, index, handlers } = props;
  const [, drop] = useDrop({
    accept: ItemTypes.CATEGORY,
    hover(item, monitor) {
      if (!ref.current || item.index === index) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      handlers.moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ItemTypes.CATEGORY,
      id: item.id,
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  const border = isDragging ? "2px dashed grey" : "";

  drag(drop(ref));

  return (
    <Card
      ref={ref}
      className={clsx(
        classes.card,
        "w-full sm:w-1/2 lg:w-1/4 flex flex-col"
      )}
      style={{
        border,
        background: item.color_background || null,
      }}
    >
      <div style={{ opacity }}>
        <CardContentWrapper {...props} />
      </div>
    </Card>
  );
}

export default CategoryCard;
