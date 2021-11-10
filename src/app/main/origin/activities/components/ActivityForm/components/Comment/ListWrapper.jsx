import React from "react";
import CommentsLoadingComponent from "./Loading";
import ErrorComponent from "@catu/components/TablesUI/Error";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

function ListWrapper(props) {
  if (props.error) return <ErrorComponent />;
  if (props.loading) return <CommentsLoadingComponent />;
  if (props.noData)
    return (
      <div className="py-64 bg-gray-100 text-center italic text-gray-600 rounded-8">
        Pas de résultat de recherche
      </div>
    );

  return Object.keys(props.categories).map((key) => {
    const comments = props.categories[key];
    return (
      <div className="relative flex flex-col gap-8 w-full" key={key}>
        <div className="font-bold top-0 sticky py-8 bg-white">
          {key}
        </div>
        {comments.map((comment) => (
          <div
            key={`comment-${comment.id}`}
            className="flex justify-between w-full"
          >
            <div className="pr-16 pl-6">
              <div>{props.getHighlightedText(comment.value)}</div>
              <div className="text-gray-500 italic">
                English:{" "}
                {comment.value_en
                  ? props.getHighlightedText(comment.value_en)
                  : "Pas de traduction disponible"}
              </div>
            </div>
            <ButtonGroup color="primary" className="items-start">
              <Button
                onClick={() => props.handleClick(comment.value_en)}
                disabled={!comment.value_en}
                disableElevation
              >
                EN
              </Button>
              <Button
                onClick={() => props.handleClick(comment.value)}
                disabled={!comment.value}
                disableElevation
              >
                FR
              </Button>
            </ButtonGroup>
          </div>
        ))}
      </div>
    );
  });
}

export default React.memo(ListWrapper);
