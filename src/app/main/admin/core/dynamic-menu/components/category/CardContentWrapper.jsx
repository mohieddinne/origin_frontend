import React, { useState, useEffect } from "react";
import CategoryPreview from "./CategoryPreview";
import CategoryForm from "./CategoryForm";

function CardContentWrapper(props) {
  const { item, index, isNew } = props;
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (isNew) setEdit(true);
  }, [isNew]);

  return (
    <>
      <CategoryPreview
        index={index}
        item={item}
        edit={edit}
        handlers={{ ...props.handlers, setEdit }}
      />
      <CategoryForm
        index={index}
        item={item}
        edit={edit}
        isNew={isNew}
        handlers={{ ...props.handlers, setEdit }}
      />
    </>
  );
}

export default CardContentWrapper;
