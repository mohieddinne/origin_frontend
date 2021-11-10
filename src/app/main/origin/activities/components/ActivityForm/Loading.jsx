import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  "@keyframes aniVertical": {
    "0%": {
      opacity: 0,
    },
    "50%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },
  "@keyframes aniHorizontal": {
    "0%": {
      backgroundPosition: "-100% 0",
    },
    "100%": {
      backgroundPosition: "100% 0",
    },
  },
  loadingRow: {
    width: "100%",
    animation: "$aniVertical 3s ease",
    animationIterationCount: "infinite",
    animationFillMode: "forwards",
    opacity: 0,
    "& .x:nth-child(2)": {
      animationDelay: ".5s",
    },
    "& .x:nth-child(3)": {
      animationDelay: "1s",
    },
    "& .datagrid__loader": {
      minHeight: "53px",
      background: "#e2e2e2",
      borderRadius: "5px",
    },
    "& .dataround__loader": {
      minHeight: "53px",
      background: "#e2e2e2",
      borderRadius: "100%",
    },
  },
}));

function CommentsLoadingComponent() {
  const classes = useStyles();

  const animationCount = 8;
  const totalAnimationDelay = 1;

  const animations = [...Array(animationCount).keys()];

  return (
    <div className="flex flex-col gap-8 w-full p-10 lg:w-2/3">
      {animations.map((i, k) => {
        const delay =
          (totalAnimationDelay / animationCount) * (k + 1);
        return (
          <div
            key={k}
            className={clsx(
              "flex items-center gap-8 my-8",
              classes.loadingRow
            )}
            style={{ animationDelay: delay + "s" }}
          >
            <div className="flex-grow gap-8 flex flex-wrap pr-16">
              <div
                className="datagrid__loader"
                style={{
                  width: `${Math.floor(Math.random() * 51) + 50}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(CommentsLoadingComponent);
